package com.hcmus.softdes.aivideocreator.infrastructure.external.r2storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;

@Service
public class R2Service implements R2Client {

    @Value("${cloudflare.r2.bucket-name}")
    private String bucketName;

    private final S3Client s3Client;

    public R2Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadVideo(String key, InputStream videoStream, long size) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType("video/mp4")
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(videoStream, size));

        return String.format("https://pub-647c59c8fa3c4daaae41ac0c0be27bf1.r2.dev/%s", key);
    }

    @Override
    public void deleteVideo(String key) {
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
    }

    @Override
    public boolean videoExists(String key) {
        try {
            s3Client.headObject(builder -> builder.bucket(bucketName).key(key));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public InputStream getVideo(String key) {
        return s3Client.getObject(builder -> builder.bucket(bucketName).key(key));
    }

    public String uploadFile(String filename, byte[] data, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .contentType(contentType)
                .acl("public-read")
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(data));
        return String.format("https://pub-647c59c8fa3c4daaae41ac0c0be27bf1.r2.dev/%s", filename);
    }

    @Override
    public void deleteFile(String filename) {
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(filename));
    }
}