package com.hcmus.softdes.aivideocreator.api.controllers;

import com.hcmus.softdes.aivideocreator.application.dto.upload.PlatformUploadResponse;
import com.hcmus.softdes.aivideocreator.application.service.UserService;
import com.hcmus.softdes.aivideocreator.application.service.VideoService;
import com.hcmus.softdes.aivideocreator.infrastructure.external.upload.YouTubeUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
public class UploadController {

    private final YouTubeUploadService youtubeService;
    private final UserService authService;
    private final VideoService videoService;

    @Autowired
    public UploadController(YouTubeUploadService youtubeService,
                            UserService authService, VideoService videoService) {
        this.youtubeService = youtubeService;
        this.authService = authService;
        this.videoService = videoService;
    }

    @PostMapping("/youtube")
    public ResponseEntity<PlatformUploadResponse> uploadToYoutube(@RequestParam("file") MultipartFile file,
                                                  @RequestParam String title,
                                                  @RequestParam String description,
                                                  @RequestParam String VideoId) throws Exception {
        File tempFile = File.createTempFile("video", ".mp4");
        file.transferTo(tempFile);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String email = authService.findUserByUsername(username).getEmail();
        var accessToken = authService.getGoogleAccessToken(email);

        String youtubeVideoId = youtubeService.uploadVideo(tempFile, accessToken, title, description);
        UUID videoId = VideoId != null ? UUID.fromString(VideoId) : UUID.randomUUID();
        videoService.saveYouTubeVideoId(youtubeVideoId, videoId);
        tempFile.delete();
        
        PlatformUploadResponse response = new PlatformUploadResponse(
            "Video uploaded successfully. YouTube ID: " + youtubeVideoId,
            youtubeVideoId
        );
        return ResponseEntity.ok(response);
    }

}
