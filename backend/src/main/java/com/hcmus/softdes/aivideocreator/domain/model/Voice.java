package com.hcmus.softdes.aivideocreator.domain.model;

import com.azure.core.annotation.Get;
import com.hcmus.softdes.aivideocreator.domain.common.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@SuperBuilder
@Getter
@Setter
public class Voice extends Entity {
    String text;
    String languageCode;
    String voiceGender;
    String provider;
    String url; // Order in the script
    int duration;// Duration in seconds
    double speakingRate;
    String filename;
    UUID scriptId;
    UUID projectId;

    public Voice(
        UUID id,
        LocalDateTime createAt,
        LocalDateTime updateAt,
        String text,
        String languageCode,
        String provider,
        int duration,
        String url,
        String gender,
        String filename,
        UUID scriptId,
        UUID projectId
    ) {
        super(id, createAt, updateAt);
        this.text = text;
        this.languageCode = languageCode;
        this.provider = provider;
        this.duration = duration;
        this.url = url;
        this.scriptId = scriptId;
        this.speakingRate = 1.0;
        this.filename = filename;
        this.voiceGender = gender;
        this.projectId = projectId;
    }

    public static Voice create(String text, String languageCode, String provider, int duration, String url, String voiceGender, String filename, UUID scriptId, UUID projectId) {
        return create(text, languageCode, provider, duration, url, voiceGender, filename, scriptId, projectId, 1.0);
    }
    
    public static Voice create(String text, String languageCode, String provider, int duration, String url, String voiceGender, String filename, UUID scriptId, UUID projectId, double speakingRate) {
        Voice voice = new Voice(
            UUID.randomUUID(),
            LocalDateTime.now(),
            LocalDateTime.now(),
            text,
            languageCode,
            provider,
            duration,
            url,
            voiceGender,
            filename,
            scriptId,
            projectId);
        voice.setSpeakingRate(speakingRate);
        return voice;
    }
}
