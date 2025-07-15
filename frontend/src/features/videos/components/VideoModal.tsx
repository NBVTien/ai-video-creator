"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUploadToYouTube, useUploadToTikTok, useDeleteVideo, useGetYouTubeStats, useUpdateVideo } from "../../videos/api/video";
import { useSession, signIn } from "next-auth/react";

interface Video {
  id: string;
  title?: string;
  description?: string;
  filePath?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  platform?: "NONE" | "YOUTUBE" | "TIKTOK" | "FACEBOOK";
  duration?: number;
  youtubeId?: string;
  projectId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnailUrl?: string;
  alt?: string;
}

interface VideoModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, video, onClose }) => {
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [activeTab, setActiveTab] = useState<"details" | "share">("details");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("YOUTUBE");
  const [imageError, setImageError] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Authentication hooks
  const { data: session } = useSession();

  // Upload hooks
  const uploadToYouTube = useUploadToYouTube();
  const uploadToTikTok = useUploadToTikTok();
  const deleteVideo = useDeleteVideo();
  const youtubeStatsQuery = useGetYouTubeStats(video?.youtubeId || "");
  const updateVideo = useUpdateVideo();

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Update form state when video changes
  React.useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setImageError(false);
    }
  }, [video]);

  if (!isOpen || !video || deleted) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }
    updateVideo.mutate(
      { id: video.id, data: { title, description, status: video.status, platform: video.platform } },
      {
        onSuccess: () => {
          alert("Video updated successfully!");
          // Update local video object so modal reflects new title/description
          if (video) {
            video.title = title;
            video.description = description;
          }
          // Optionally, force a re-render by updating state
          setTitle(title);
          setDescription(description);
        },
        onError: (error) => {
          alert("Failed to update video: " + error.message);
        }
      }
    );
  };

  const handleShare = async () => {
    if (!video?.filePath) {
      alert("❌ No video file available for upload");
      return;
    }

    // Check if user is trying to share to YouTube
    if (selectedPlatform === "YOUTUBE") {
      // Check if user has Google authentication by looking at the session
      // For Google users, the session will contain user data with Google OAuth tokens
      const hasGoogleAuth = session?.user?.accessToken && session?.user?.email;
      
      if (!hasGoogleAuth) {
        // User is not authenticated with Google, show informative message
        const userConfirmed = confirm(
          "YouTube Upload Requires Google Authentication\n\n" +
          "To upload videos to YouTube, you need to be logged in with your Google account. " +
          "This allows us to access your YouTube channel with proper permissions.\n\n" +
          "Would you like to sign in with Google now?"
        );
        
        if (userConfirmed) {
          // Redirect to Google OAuth with YouTube scope
          await signIn('google', { 
            callbackUrl: window.location.href, // Return to current page after login
            redirect: true
          });
        }
        return;
      }
    }

    try {
      // Convert video file path to actual File object
      console.log("🔄 Preparing video file for upload...");
      const response = await fetch(video.filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch video file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], `${video.title || 'video'}.mp4`, { type: 'video/mp4' });

      if (selectedPlatform === "YOUTUBE") {
        const uploadData = {
          file,
          title: title || video.title || "Untitled Video",
          description: description || video.description || "Uploaded from AI Video Creator",
          videoId: video.id // Pass videoId as required by backend
        };

        console.log("🚀 Uploading to YouTube...", {
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          title: uploadData.title,
          description: uploadData.description
        });

        uploadToYouTube.mutate(uploadData, {
          onSuccess: (response) => {
            console.log("✅ Upload successful:", response);
            // Refresh the page to get updated video data with YouTube ID and platform
            window.location.reload();
            alert(`✅ Successfully uploaded to YouTube!\n\n${response.message || response}`);
          },
          onError: (error: Error) => {
            console.error("❌ Upload failed:", error);
            // const errorMessage = error.message || "Unknown error occurred";
            alert(`❌ Need login by Google to upload to YouTube`);
          }
        });
      } else if (selectedPlatform === "TIKTOK") {
        const uploadData = {
          file,
          title: title || video.title || "Untitled Video"
        };

        console.log("🚀 Uploading to TikTok...", {
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          title: uploadData.title
        });

        uploadToTikTok.mutate(uploadData, {
          onSuccess: (response) => {
            console.log("✅ Upload successful:", response);
            alert(`✅ Successfully uploaded to TikTok!\n\n${response.message || response}`);
          },
          onError: (error: Error) => {
            console.error("❌ Upload failed:", error);
            const errorMessage = error.message || "Unknown error occurred";
            alert(`❌ Failed to upload to TikTok:\n\n${errorMessage}`);
          }
        });
      } else {
        console.log("Sharing video:", { id: video.id, platform: selectedPlatform });
        // TODO: Implement Facebook upload
        alert(`ℹ️ ${selectedPlatform} upload not implemented yet`);
      }
    } catch (error: unknown) {
      console.error("❌ Error preparing file:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`❌ Failed to prepare video file for upload:\n\n${errorMessage}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      deleteVideo.mutate(video.id, {
        onSuccess: () => {
          setDeleted(true);
          alert("Video deleted!");
          onClose();
        },
        onError: (error) => {
          alert("Failed to delete video: " + error.message);
        }
      });
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      COMPLETED: { color: "#10b981", bg: "#d1fae5", text: "Completed" },
      PENDING: { color: "#f59e0b", bg: "#fef3c7", text: "Processing" },
      FAILED: { color: "#ef4444", bg: "#fee2e2", text: "Failed" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: "#6b7280", bg: "#f3f4f6", text: status };
    
    return (
      <span
        style={{
          backgroundColor: config.bg,
          color: config.color,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
          animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={handleBackgroundClick}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)",
            width: "90%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            overflow: "hidden",
            animation: "modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.025em",
                }}
              >
                Video Details
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "4px 0 0 0",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Manage your video content and sharing options
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(0, 0, 0, 0.05)",
                border: "none",
                borderRadius: "12px",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "#6b7280",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.color = "#374151";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: "calc(90vh - 140px)",
              maxHeight: "600px",
            }}
          >
            {/* Left Panel - Video Preview */}
            <div
              style={{
                padding: "32px",
                borderRight: "1px solid rgba(0, 0, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Video Preview */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#f9fafb",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  aspectRatio: "16/9",
                }}
              >
                {video.filePath ? (
                  <video
                    src={video.filePath}
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "#000",
                      borderRadius: "16px",
                    }}
                    onError={(e) => {
                      console.error("Video failed to load:", e);
                      setImageError(true);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : video.thumbnailUrl && !imageError ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || "Video thumbnail"}
                    onError={() => setImageError(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: "16px",
                    }}
                  >
                    <Image
                      src="/videoTemp.svg"
                      width={80}
                      height={80}
                      alt="Video placeholder"
                      style={{ opacity: 0.3 }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        fontFamily: "'Inter', sans-serif",
                        textAlign: "center",
                      }}
                    >
                      {imageError ? "Video unavailable" : "No video available"}
                    </p>
                  </div>
                )}
                
                {/* Duration overlay - only show if video is not available or on thumbnails */}
                {video.duration && (!video.filePath || (!video.filePath && video.thumbnailUrl && !imageError)) && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {video.status && getStatusBadge(video.status)}
                  {video.createdAt && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {new Date(video.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "1.3",
                  }}
                >
                  {video.title || "Untitled Video"}
                </h2>
                {/* Platform Display */}
                {video.platform && video.platform !== "NONE" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: "#8b5cf6", fontWeight: 600 }}>
                      Uploaded to {video.platform}
                    </span>
                  </div>
                )}
                {/* YouTube Stats */}
                {video.platform === "YOUTUBE" && youtubeStatsQuery.data && (
                  <div style={{
                    background: "#f1f5f9",
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                    color: "#334155"
                  }}>
                    <div><b>Views:</b> {youtubeStatsQuery.data.views?.toLocaleString() || "0"}</div>
                    <div><b>Likes:</b> {youtubeStatsQuery.data.likes?.toLocaleString() || "0"}</div>
                    <div><b>Comments:</b> {youtubeStatsQuery.data.comments?.toLocaleString() || "0"}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Form and Actions */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Tab Navigation */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                {[
                  { id: "details", label: "Details", icon: "📝" },
                  { id: "share", label: "Share", icon: "🔗" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "details" | "share")}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      border: "none",
                      background: "transparent",
                      fontSize: "14px",
                      fontWeight: activeTab === tab.id ? "600" : "500",
                      color: activeTab === tab.id ? "#8b5cf6" : "#6b7280",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      borderBottom: activeTab === tab.id ? "2px solid #8b5cf6" : "2px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, padding: "32px", overflow: "auto" }}>
                {activeTab === "details" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Title Input */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title..."
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#8b5cf6";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter video description..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#ffffff",
                          resize: "vertical",
                          minHeight: "100px",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#8b5cf6";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Save Button */}
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={handleSave}
                        style={{
                          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                          color: "white",
                          padding: "12px 24px",
                          borderRadius: "12px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 92, 246, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Save Changes
                      </button>
                      {/* Download Button */}
                      {video.filePath && (
                        <button
                          onClick={() => {
                            if (video.filePath) {
                              const link = document.createElement('a');
                              link.href = video.filePath;
                              link.download = `${video.title || 'video'}.mp4`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          style={{
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "white",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontFamily: "'Inter', sans-serif",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Download Video
                        </button>
                      )}
                      {/* Delete Button */}
                      <button
                        onClick={handleDelete}
                        style={{
                          background: "linear-gradient(135deg, #ef4444, #f87171)",
                          color: "white",
                          padding: "12px 24px",
                          borderRadius: "12px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Delete Video
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "share" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Platform Selection */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "12px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Choose Platform
                      </label>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {["YOUTUBE"].map((platform) => (
                          <button
                            key={platform}
                            onClick={() => setSelectedPlatform(platform)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "12px 16px",
                              border: selectedPlatform === platform ? "2px solid #8b5cf6" : "1px solid #d1d5db",
                              borderRadius: "12px",
                              background: selectedPlatform === platform ? "rgba(139, 92, 246, 0.1)" : "#ffffff",
                              color: selectedPlatform === platform ? "#8b5cf6" : "#6b7280",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                              fontFamily: "'Inter', sans-serif",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Google Auth Status for YouTube */}
                    {selectedPlatform === "YOUTUBE" && (
                      <div
                        style={{
                          padding: "16px",
                          backgroundColor: session?.user?.accessToken ? "#f0fdf4" : "#fef3c7",
                          border: `1px solid ${session?.user?.accessToken ? "#bbf7d0" : "#f59e0b"}`,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: session?.user?.accessToken ? "#16a34a" : "#92400e",
                              margin: 0,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {session?.user?.accessToken 
                              ? "✓ Google Connected" 
                              : "⚠️ Google Authentication Required"}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: session?.user?.accessToken ? "#16a34a" : "#92400e",
                              margin: "2px 0 0 0",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {session?.user?.accessToken 
                              ? "Ready to upload to YouTube" 
                              : "Click 'Share to YouTube' to connect with Google"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Current Platform Status */}
                    {video.platform && video.platform !== "NONE" && (
                      <div
                        style={{
                          padding: "16px",
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#16a34a",
                              margin: 0,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Published on {video.platform}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#16a34a",
                              margin: "2px 0 0 0",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Video is currently live on this platform
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      disabled={uploadToYouTube.isPending || uploadToTikTok.isPending}
                      style={{
                        background: (uploadToYouTube.isPending || uploadToTikTok.isPending)
                          ? "linear-gradient(135deg, #9ca3af, #6b7280)" 
                          : "linear-gradient(135deg, #06b6d4, #0891b2)",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: (uploadToYouTube.isPending || uploadToTikTok.isPending) ? "not-allowed" : "pointer",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        alignSelf: "flex-start",
                        opacity: (uploadToYouTube.isPending || uploadToTikTok.isPending) ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!uploadToYouTube.isPending && !uploadToTikTok.isPending) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(6, 182, 212, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {(uploadToYouTube.isPending || uploadToTikTok.isPending)
                        ? `Uploading to ${selectedPlatform}...`
                        : `Share to ${selectedPlatform}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default VideoModal;
