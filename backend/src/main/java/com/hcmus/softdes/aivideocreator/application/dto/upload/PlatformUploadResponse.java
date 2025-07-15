package com.hcmus.softdes.aivideocreator.application.dto.upload;

public class PlatformUploadResponse {
    private String message;
    private String videoId;

    public PlatformUploadResponse(String message, String videoId) {
        this.message = message;
        this.videoId = videoId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }
}