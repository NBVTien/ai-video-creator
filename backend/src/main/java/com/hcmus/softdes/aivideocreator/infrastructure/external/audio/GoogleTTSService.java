package com.hcmus.softdes.aivideocreator.infrastructure.external.audio;

import com.google.cloud.texttospeech.v1.*;
import com.hcmus.softdes.aivideocreator.application.dto.voice.TtsRequest;
import com.hcmus.softdes.aivideocreator.domain.model.Voice;
import org.springframework.stereotype.Service;

@Service("google")
public class GoogleTTSService implements TtsService {

    private final TextToSpeechClient ttsClient;

    public GoogleTTSService(TextToSpeechClient ttsClient) {
        this.ttsClient = ttsClient;
    }

    private String normalizeLanguageCode(String languageCode) {
        switch (languageCode) {
            case "vi":
                return "vi-VN";
            case "en":
                return "en-US";
            case "ja":
                return "ja-JP";
            case "ko":
                return "ko-KR";
            case "zh":
                return "zh-CN";
            default:
                return languageCode;
        }
    }

    private String getVoiceName(String languageCode, String gender) {
        String normalizedCode = normalizeLanguageCode(languageCode);
        String genderSuffix = "FEMALE".equalsIgnoreCase(gender) ? "A" : "D";
        
        switch (normalizedCode) {
            case "vi-VN":
                return "vi-VN-Neural2-" + genderSuffix;
            case "en-US":
                return "en-US-Neural2-" + genderSuffix;
            case "ja-JP":
                return "ja-JP-Neural2-" + genderSuffix;
            case "ko-KR":
                return "ko-KR-Neural2-" + genderSuffix;
            case "zh-CN":
                return "zh-CN-Neural2-" + genderSuffix;
            default:
                return normalizedCode + "-Standard-" + genderSuffix;
        }
    }

    @Override
    public byte[] synthesize(TtsRequest request) {
        try {
            String normalizedLanguageCode = normalizeLanguageCode(request.getLanguageCode());
            
            SynthesisInput input = SynthesisInput.newBuilder().setText(request.getText()).build();
            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode(normalizedLanguageCode)
                    .setName(getVoiceName(request.getLanguageCode(), request.getGender()))
                    .setSsmlGender(SsmlVoiceGender.valueOf(request.getGender().toUpperCase()))
                    .build();
            AudioConfig config = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .setSpeakingRate(request.getSpeakingRate())
                    .build();
            SynthesizeSpeechResponse response = ttsClient.synthesizeSpeech(input, voice, config);
            return response.getAudioContent().toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Google TTS error: " + e.getMessage());
        }
    }
}
