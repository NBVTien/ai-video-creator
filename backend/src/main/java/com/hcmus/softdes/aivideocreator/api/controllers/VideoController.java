package com.hcmus.softdes.aivideocreator.api.controllers;

import com.google.api.services.youtube.model.VideoStatistics;
import com.hcmus.softdes.aivideocreator.api.mappers.VideoMapper;
import com.hcmus.softdes.aivideocreator.application.dto.video.VideoDto;
import com.hcmus.softdes.aivideocreator.application.service.VideoService;
import com.hcmus.softdes.aivideocreator.domain.model.Video;
import com.hcmus.softdes.aivideocreator.infrastructure.external.upload.YouTubeUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.UUID;


@RestController
@RequestMapping("/api/videos")
public class VideoController {
    VideoService videoService;
    YouTubeUploadService youtubeService;
    VideoMapper videoMapper = new VideoMapper();

    public VideoController(VideoService videoService, YouTubeUploadService youtubeService) {
        this.videoService = videoService;
        this.youtubeService = youtubeService;
    }

    @PostMapping
    @Operation(summary = "Create a new video from local file",
            description = "Create a new video using a local file path.")
    public ResponseEntity<VideoDto> createVideo(@RequestBody VideoDto request) {
        if (request.getTitle() == null || request.getDescription() == null || request.getFilePath() == null) {
            return ResponseEntity.badRequest().build();
        }
        videoService.createVideo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }
    @GetMapping("/videos/{videoId}")
    @Operation(summary = "Get video by ID",
            description = "Retrieve a video by its unique identifier.")
    public ResponseEntity<VideoDto> getVideo(@PathVariable UUID videoId) {
        Video video = videoService.getVideo(videoId);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }
        VideoDto videoDto = VideoMapper.toVideoDto(video);
        return ResponseEntity.ok(videoDto);
    }

    @GetMapping("/videos")
    @Operation(summary = "Get all videos",
            description = "Retrieve all videos associated with the user.")
    public ResponseEntity<VideoDto[]> getAllVideos() {
        VideoDto[] videoResponses = videoService.getVideosByUserId(null).stream()
                .map(VideoMapper::toVideoDto)
                .toArray(VideoDto[]::new);
        if (videoResponses.length == 0) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(videoResponses);
    }

    @DeleteMapping("/videos/{videoId}")
    @Operation(summary = "Delete video by ID",
            description = "Delete a video by its unique identifier.")
    public ResponseEntity<Void> deleteVideo(@PathVariable UUID videoId) {
        // Logic to delete a video by its ID
        try {
            videoService.deleteVideo(videoId);
        } catch (RuntimeException e) {
            // If the video is not found, return 404 Not Found
            return ResponseEntity.notFound().build();
        }
        // If deletion is successful, return 204 No Content
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{videoId}/analytics")
    public ResponseEntity<VideoStatistics> getAnalytics(@PathVariable String videoId) {
        try {
            VideoStatistics stats = youtubeService.getYouTubeVideoStats(videoId);
            if (stats == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
