"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/features/dashboard/components/Sidebar";
import HeaderSection from "@/features/projects/components/HeaderSection";
import TextInput from "@/features/projects/components/TextInput";
import ResourceSection from "@/features/projects/components/ResourceSection";
import TemplateChooserPopup from "@/components/videoTemplates/TemplateChooserPopup";
import VideoModal from "@/features/videos/components/VideoModal";
import { useGenerateScript } from "@/features/projects/api/script";
import { useGetProject, useUpdateProject } from "@/features/projects/api/project";
import { useCreateVideo, Video } from "@/features/videos/api/video";
import { GeneratedResource } from "@/types/resource";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { transformScriptResponseWithLoading, transformProjectScriptsToResources } from "@/utils/scriptHelpers";
import { generateImageForScript } from "@/features/projects/api/image";
import { generateTtsForScript } from "@/features/projects/api/tts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { extractDataToAPI } from "@/utils/dataExtractor";
import { useVideoRender } from "@/features/videoRender/hooks/useVideoRender";
import { handleVideoComplete, handleVideoError } from "@/utils/videoActions";

// Types for static fallback data
interface VideoData {
  title: string;
  context: string;
  contents: {
    description: string;
    image: string;
    subtitles: {
      text: string;
      audio: string;
      duration: number;
    }[];
  }[];
}

interface VideoConfig {
  template: { name: string };
  width: number;
  height: number;
  fps: number;
  enableTransitions: boolean;
  transitionDuration: number;
  fitMode: string;
  transitionEffect: string;
  audioConfig?: string;
}

function ProjectPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  
  const [inputText, setInputText] = useState("");
  const [resources, setResources] = useState<GeneratedResource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [context, setContext] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState("Loading...");
  const [showTemplateChooser, setShowTemplateChooser] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { addToast } = useToast();
  
  const generateScript = useGenerateScript();
  const updateProject = useUpdateProject();
  const createVideo = useCreateVideo();
  
  // Custom video completion handler
  const handleVideoCompleteWithSave = (videoUrl: string) => {
    handleVideoComplete(
      videoUrl,
      async () => {
        try {
          // Create video record in backend
          const videoData = await createVideo.mutateAsync({
            title: projectTitle || "Generated Video",
            description: `Video generated from project: ${projectTitle}`,
            filePath: videoUrl,
            status: "COMPLETED",
            platform: "NONE",
            duration: 0, // We don't have duration info from render
            projectId: projectId,
          });

          // Show success message
          addToast("Video saved successfully!", "success");
          
          // Show video modal
          setSelectedVideo(videoData);
          setIsVideoModalOpen(true);
        } catch (error) {
          console.error("Error saving video:", error);
          addToast("Video rendered successfully but failed to save to database", "warning");
        }
      },
      {
        projectId: projectId,
        projectTitle: projectTitle,
        context: context
      }
    );
  };

  // Close video modal handler
  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };
  
  const {
    renderVideo,
    status,
    isRendering,
    error,
    progress,
    currentVideoId,
    cancelRender
  } = useVideoRender({
    onComplete: handleVideoCompleteWithSave,
    onError: handleVideoError,
    onProgress: (status) => {
      console.log(`Render progress: ${status.progress}%`);
    }
  });
  
  const { data: project, isLoading: isProjectLoading, error: projectError } = useGetProject(projectId);

  // Set input text from URL parameter when component mounts
  useEffect(() => {
    const inputFromUrl = searchParams.get('input');
    if (inputFromUrl) {
      setInputText(decodeURIComponent(inputFromUrl));
      // Remove the input parameter from URL to clean it up
      const url = new URL(window.location.href);
      url.searchParams.delete('input');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (project) {
      const projectName = project.name || "Untitled";
      setProjectTitle(projectName);
      
      if (project.scripts && project.scripts.length > 0) {
        const existingResources = transformProjectScriptsToResources(project.scripts);
        setResources(existingResources);
        setContext('');
      }
    } else if (!isProjectLoading && projectError) {
      const isNotFound = projectError.message?.includes('404') 
        || projectError.message?.includes('Not Found') 
        || projectError.message?.includes('not found');
      
      let redirectTimeout: NodeJS.Timeout;
      
      if (isNotFound) {
        addToast("Dự án không tồn tại. Đang chuyển hướng về danh sách dự án.", "error");
        redirectTimeout = setTimeout(() => {
          router.push("/projects");
        }, 1500);
      } else {
        addToast("Không thể tải dự án. Đang chuyển hướng về danh sách dự án.", "error");
        redirectTimeout = setTimeout(() => {
          router.push("/projects");
        }, 2000);
      }
      
      return () => {
        if (redirectTimeout) {
          clearTimeout(redirectTimeout);
        }
      };
    }
  }, [project, isProjectLoading, projectError, projectId, addToast, router]);

  const handleTitleChange = (newTitle: string) => {
    setProjectTitle(newTitle);
    
    if (project && newTitle.trim() && newTitle !== (project.name)) {
      updateProject.mutate(
        { 
          id: projectId, 
          data: { name: newTitle } 
        },
        {
          onSuccess: () => {
            addToast("Đã lưu tên dự án thành công!", "success");
          },
          onError: () => {
            addToast("Không thể lưu tên dự án!", "error");
          }
        }
      );
    }
  };

  const generateResources = async (settings: {
    script: { style: string; model: string };
    audio: { gender: string; language: string; speedRate: number; model: string };
    image: { style: string };
  }) => {
    if (!inputText.trim()) {
      addToast("Vui lòng nhập nội dung trước khi tạo tài nguyên!", "warning");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await generateScript.mutateAsync({ 
        prompt: inputText,
        provider: settings.script.model,
        projectId: projectId,
        scriptStyle: settings.script.style,
        scriptModel: settings.script.model,
        audioGender: settings.audio.gender,
        audioLanguage: settings.audio.language,
        audioSpeedRate: settings.audio.speedRate,
        audioModel: settings.audio.model,
        imageStyle: settings.image.style,
      }); 
      setContext(response.context);

      const newResources: GeneratedResource[] = transformScriptResponseWithLoading(response);
      
      setResources(() => [...newResources]);
      setInputText(""); 
      addToast(`Đã tạo thành công ${newResources.length} tài nguyên!`, "success");
      
      addToast("Đang tạo hình ảnh và âm thanh...", "info"); 
      
      const resourcePromises = newResources.map(async (resource) => {
        if (typeof resource.textContent === 'string') {
          const imagePromise = generateImageForScript({
            prompt: resource.textContent,
            context: response.context,
            provider: "gemini-image",
            projectId: projectId,
            scriptId: resource.id,
            style: settings.image.style,
          })
          .then(imageResponse => {
            const imageUrl = imageResponse.url;
            updateResource(resource.id, { imageSrc: imageUrl, isImageLoading: false });
            return imageUrl;
          })
          .catch(error => {
            console.error(`Error generating image for resource ${resource.id}:`, error);
            updateResource(resource.id, { isImageError: true, isImageLoading: false });
          });

          const audioPromise = generateTtsForScript({
            text: resource.textContent,
            languageCode: settings.audio.language || response.language,
            speakingRate: settings.audio.speedRate,
            gender: settings.audio.gender,
            projectId: projectId,
            scriptId: resource.id,
            provider: settings.audio.model,
            model: settings.audio.model,
          })
          .then(audioResponse => {
            updateResource(resource.id, { audioSrc: audioResponse.audioUrl, isAudioLoading: false });
          })
          .catch(error => {
            console.error(`Error generating audio for resource ${resource.id}:`, error);
            updateResource(resource.id, { isAudioError: true, isAudioLoading: false });
          });

          return Promise.all([imagePromise, audioPromise]);
        }
      });
      
      await Promise.all(resourcePromises);
      addToast("Đã hoàn thành tạo hình ảnh và âm thanh!", "success");
    } catch (error) {
      console.error("Error generating script:", error);
      addToast("API không khả dụng!", "info");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to convert project data to video data format
  const convertProjectToVideoData = (): VideoData | null => {
    if (resources.length > 0) {
      return {
        title: projectTitle,
        context: context || project?.imageContext || "Default context for video generation",
        contents: resources.map(resource => ({
          description: typeof resource.textContent === 'string' ? resource.textContent : "Generated content",
          image: resource.imageSrc || "",
          subtitles: [{
            text: typeof resource.textContent === 'string' ? resource.textContent : "Generated text content",
            audio: resource.audioSrc || "",
            duration: resource.audioDuration || 8000, 
          }]
        }))
      };
    }

    if (project?.scripts && project.scripts.length > 0) {
      return {
        title: project.name || "Untitled",
        context: project.imageContext || "Video context from project data",
        contents: project.scripts.map(script => ({
          description: script.content,
          image: script.media?.url || "",
          subtitles: [{
            text: script.content,
            audio: script.voice?.audioUrl || "",
            duration: script.voice?.duration ? script.voice.duration : 8000,
          }]
        }))
      };
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resources.length === 0 && (!project?.scripts || project.scripts.length === 0)) {
      addToast("Vui lòng tạo nội dung trước khi tạo video!", "warning");
      return;
    }
    
    setShowTemplateChooser(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resources.length === 0 && (!project?.scripts || project.scripts.length === 0)) {
      addToast("Vui lòng tạo nội dung trước khi chỉnh sửa video!", "warning");
      return;
    }
    
    // Add loading toast
    addToast("🚀 Opening video editor...", "info");
    
    try {
      // Get current video data (project data, dynamic resources, or static fallback)
      const videoData = convertProjectToVideoData();
      
      // Extract data in API format with default settings
      const apiData = extractDataToAPI(videoData, {
        width: 1920,
        height: 1080,
        fps: 30,
        enableTransitions: true,
        transitionDuration: 1000,
        defaultFitMode: 'cover',
        defaultTransition: 'fade'
      });

      // Add audio configuration
      (apiData.config as Record<string, unknown>).audioConfig = 'background';

      // Generate unique ID for this video
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare video data
      const editorVideoData = {
        id: videoId,
        originalData: videoData,
        apiData: apiData,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Preparing to send video data:', editorVideoData);

      // Open editor in new tab
      const editorUrl = `http://localhost:5173/?videoId=${videoId}`;
      const editorWindow = window.open(editorUrl, '_blank');

      if (!editorWindow) {
        addToast('❌ Popup blocked! Please allow popups for this site.', 'error');
        return;
      }

      // Wait for editor window to load, then send data
      const sendDataWhenReady = () => {
        const maxAttempts = 100; // 20 seconds max
        let attempts = 0;
        let dataReceived = false;

        // Listen for confirmation from editor
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== 'http://localhost:5173') return;
          
          if (event.data.type === 'DATA_RECEIVED' && event.data.videoId === videoId) {
            console.log('✅ Editor confirmed data received');
            dataReceived = true;
            addToast('✅ Video data sent to editor successfully!', 'success');
            window.removeEventListener('message', handleMessage);
          }
        };

        window.addEventListener('message', handleMessage);

        const trySendData = () => {
          attempts++;
          
          try {
            // Check if window is still open
            if (editorWindow.closed) {
              console.error('❌ Editor window was closed');
              addToast('❌ Editor window was closed. Please try again.', 'error');
              window.removeEventListener('message', handleMessage);
              return;
            }

            console.log(`📤 Sending data attempt ${attempts}/${maxAttempts}...`);
            
            editorWindow.postMessage({
              type: 'VIDEO_DATA',
              payload: editorVideoData
            }, 'http://localhost:5173');
            
            // Check for confirmation after a delay
            setTimeout(() => {
              if (!dataReceived && attempts < maxAttempts && !editorWindow.closed) {
                trySendData();
              } else if (!dataReceived && attempts >= maxAttempts) {
                console.error('❌ Failed to send data after max attempts');
                addToast('❌ Failed to send data to editor. Please check if editor is running on localhost:5173', 'error');
                window.removeEventListener('message', handleMessage);
              }
            }, 200);
            
          } catch (sendError) {
            console.log(`❌ Attempt ${attempts} failed:`, sendError);
            
            if (attempts < maxAttempts && !editorWindow.closed) {
              setTimeout(trySendData, 500);
            } else {
              console.error('❌ Failed to send data after max attempts');
              addToast('❌ Failed to send data to editor. Please ensure editor is running.', 'error');
              window.removeEventListener('message', handleMessage);
            }
          }
        };

        // Start trying after editor has time to load
        setTimeout(trySendData, 2000);
        
        // Cleanup listener after timeout
        setTimeout(() => {
          if (!dataReceived) {
            window.removeEventListener('message', handleMessage);
          }
        }, 30000); // 30 second total timeout
      };

      sendDataWhenReady();

    } catch (error) {
      console.error('❌ Error preparing video data:', error);
      addToast('Lỗi khi chuẩn bị dữ liệu!', 'error');
    }
  };

  const handleTemplateSelect = async (config: VideoConfig) => {
    // Get current video data (project data, dynamic resources, or static fallback)
    const videoData = convertProjectToVideoData();
    console.log("Video Data:", videoData);
    
    // Extract data with selected template configuration
    const apiData = extractDataToAPI(videoData, {
      width: config.width,
      height: config.height,
      fps: config.fps,
      enableTransitions: config.enableTransitions,
      transitionDuration: config.transitionDuration,
      defaultFitMode: config.fitMode,
      defaultTransition: config.transitionEffect
    });

    // Add audio configuration
    (apiData.config as Record<string, unknown>).audioConfig = config.audioConfig;

    console.log("Selected Template:", config.template.name);
    console.log("API Data:", apiData);
    
    // Start rendering
    await renderVideo(apiData);
  };

    const updateResource = (resourceId: string, updates: Partial<GeneratedResource>) => {
    setResources(prevResources => {
      const updatedResources = prevResources.map(resource => 
        resource.id === resourceId ? { ...resource, ...updates } : resource
      );
      return updatedResources;
    });
  };

  // LOADING STATE
  if (isProjectLoading) {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: "1rem 2rem",
            backgroundSize: "cover",
            marginLeft: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
            <div 
              className="spinner"
              style={{ 
                width: "50px", 
                height: "50px", 
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #8362E5",
                borderRadius: "50%",
                margin: "0 auto 1rem auto"
              }}
            ></div>
            <div>Đang tải dự án...</div>
          </div>
        </main>
      </div>
    );
  }

  // ERROR STATE
  if (projectError && !project && !isProjectLoading) {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: "1rem 2rem",
            backgroundSize: "cover",
            marginLeft: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
            <div 
              className="spinner"
              style={{ 
                width: "50px", 
                height: "50px", 
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #8362E5",
                borderRadius: "50%",
                margin: "0 auto 1rem auto"
              }}
            ></div>
          </div>
        </main>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fafafa" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "2rem 3rem",
          marginLeft: "50px",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#fafafa",
            paddingBottom: "1.5rem",
          }}
        >
          <HeaderSection 
            title={projectTitle}
            onTitleChange={handleTitleChange}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
          />
          <TextInput value={inputText} onChange={setInputText} />
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <ResourceSection 
            resources={resources}
            onGenerateResources={generateResources}
            onUpdateResource={updateResource}
            isGenerating={isGenerating}
            context={project?.imageContext || context}
            projectId={projectId}
          />
        </div>
        
        {/* Template Chooser Popup */}
        <TemplateChooserPopup
          isOpen={showTemplateChooser}
          onClose={() => setShowTemplateChooser(false)}
          onSelect={handleTemplateSelect}
        />
        
        {/* Render Progress Display */}
        {isRendering && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '300px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>🎬 Rendering Video...</h3>
              <button
                onClick={cancelRender}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                title="Cancel render"
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
              Progress: {progress}%
              {status?.state && ` • ${status.state}`}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease'
              }} />
            </div>
            {currentVideoId && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                ID: {currentVideoId}
              </div>
            )}
            {error && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444' }}>
                Error: {error}
              </div>
            )}
          </div>
        )}

        {/* Video Modal */}
        <VideoModal
          isOpen={isVideoModalOpen}
          video={selectedVideo}
          onClose={handleCloseVideoModal}
        />
      </main>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ToastProvider>
        <ProjectPageContent />
      </ToastProvider>
    </ProtectedRoute>
  );
}
