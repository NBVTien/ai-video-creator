'use client';

import {
  ADD_AUDIO,
  ADD_IMAGE,
  ADD_TEXT,
  ADD_VIDEO,
  dispatch
} from "@designcombo/events";
import { Button } from "../../components/ui/button";
import { useRef, useState, useEffect } from "react";
import Timeline from "../../components/timeline";
import { generateId } from "@designcombo/timeline";
import { DEFAULT_FONT } from "../../constants/font";
import { Player } from "../../components/player";
import useStore from "../../store/store";
import useTimelineEvents from "../../hooks/use-timeline-events";

const App = () => {
  const { playerRef } = useStore();
  useTimelineEvents();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to control the adjustable timeline height (in pixels)
  const [timelineHeight, setTimelineHeight] = useState<number>(100);
  // A ref to store the initial drag data
  const dragDataRef = useRef<{ startY: number; startHeight: number } | null>(null);

  // Mouse down on the divider starts the drag process
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragDataRef.current = { startY: e.clientY, startHeight: timelineHeight };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Update the timeline height based on how far the mouse moved
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragDataRef.current) return;
    const { startY, startHeight } = dragDataRef.current;
    // Calculate the new height: dragging down increases height; dragging up decreases it.
    const newHeight = startHeight + (e.clientY - startY);
    // Constrain the minimum timeline height to 50px to prevent it from disappearing
    setTimelineHeight(newHeight < 50 ? 50 : newHeight);
  };

  // Mouse up ends the drag process and cleans up event listeners
  const handleMouseUp = () => {
    dragDataRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (files: File[]) => {
    const resourceId = "VMJQit9N0hJaCAss";
    dispatch(ADD_VIDEO, {
      payload: {
        id: resourceId,
        display: {
          from: 2000,
          to: 7000
        },
        details: {
          src: URL.createObjectURL(files[0]),
          name: files[0].name
        },
        metadata: {
          resourceId
        }
      }
    });
  };

  const handleFileChange = (newFiles: File[]) => {
    handleFileUpload(newFiles);
  };

  const handleAddImage = () => {
    dispatch(ADD_IMAGE, {
      payload: {
        id: generateId(),
        details: {
          src: "https://designcombo.imgix.net/images/sample-image.jpg"
        }
      }
    });
  };

  const handleAddVideo = () => {
    const resourceId = "VMJQit9N0hJaCAss";
    dispatch(ADD_VIDEO, {
      payload: {
        id: generateId(),
        details: {
          src: "https://designcombo.imgix.net/videos/sample-video.mp4",
          volume: 50
        },
        metadata: {
          resourceId
        }
      }
    });
  };

  const handleAddAudio = () => {
    dispatch(ADD_AUDIO, {
      payload: {
        id: generateId(),
        details: {
          src: "https://designcombo.imgix.net/audios/stop-in-the-name-of-love.mp3",
          volume: 50
        }
      }
    });
  };

  const handleAddText = () => {
    dispatch(ADD_TEXT, {
      payload: {
        id: generateId(),
        details: {
          text: "Remotion",
          fontSize: 142,
          fontFamily: DEFAULT_FONT.postScriptName,
          fontUrl: DEFAULT_FONT.url,
          width: 400,
          textAlign: "left",
          color: "#ffffff",
          left: 80
        }
      }
    });
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main content area for the player and controls */}
      <div className="flex-1 bg-background flex flex-col items-center justify-center">
        <div className="max-w-3xl flex-1 w-full h-full flex">
          <Player />
        </div>
        <div className="m-auto flex gap-2 py-8">
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            accept="video/*"
            onChange={(e) =>
              handleFileChange(Array.from(e.target.files || []))
            }
            className="hidden"
          />
          <Button size={"sm"} onClick={handleClick} variant={"secondary"}>
            Upload
          </Button>
          <Button size={"sm"} onClick={handleAddImage} variant={"secondary"}>
            Add Image
          </Button>
          <Button size={"sm"} onClick={handleAddVideo} variant={"secondary"}>
            Add Video
          </Button>
          <Button size={"sm"} onClick={handleAddAudio} variant={"secondary"}>
            Add Audio
          </Button>
          <Button size={"sm"} onClick={handleAddText} variant={"secondary"}>
            Add Text
          </Button>
        </div>
      </div>

      {/* Draggable divider for adjusting the timeline height */}
      {playerRef && (
        <div
          className="h-2 bg-gray-300 cursor-ns-resize"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Timeline area with adjustable height */}
      {playerRef && (
        <div style={{ height: timelineHeight, overflow: "hidden" }}>
          <Timeline />
        </div>
      )}
    </div>
  );
};

export default App;
