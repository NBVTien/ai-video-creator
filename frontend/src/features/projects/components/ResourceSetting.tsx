"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, FileText, Image as ImageIcon, Volume2 } from "lucide-react";

interface ResourceSettings {
  script: {
    style: string;
    model: string;
  };
  audio: {
    gender: string;
    language: string;
    speedRate: number;
    model: string;
  };
  image: {
    style: string;
  };
}

interface ResourceSettingProps {
  onGenerateResources: (settings: ResourceSettings) => Promise<void>;
  isGenerating: boolean;
}

export default function ResourceSetting({ onGenerateResources, isGenerating }: ResourceSettingProps) {
  // Script settings
  const [scriptStyle, setScriptStyle] = useState("Chuyên nghiệp");
  const [scriptModel, setScriptModel] = useState("Gemini");

  // Audio settings
  const [audioGender, setAudioGender] = useState("Nam");
  const [audioLanguage, setAudioLanguage] = useState("Tự động");
  const [audioSpeedRate, setAudioSpeedRate] = useState([1.0]);
  const [audioModel, setAudioModel] = useState("GoogleTTS");

  // Image settings
  const [imageStyle, setImageStyle] = useState("Thực tế");

  // Options
  const scriptStyles = ["Chuyên nghiệp", "Thân thiện", "Hài hước", "Nghiêm túc"];
  const scriptModels = ["Gemini"];
  const audioGenders = ["Nam", "Nữ"];
  const audioLanguages = ["Tự động", "English", "Tiếng Việt"];
  const audioModels = ["AzureTTS", "GoogleTTS"];
  const imageStyles = ["Thực tế", "Hoạt hình", "Nghệ thuật", "Anime", "Ghibli"];

  // Data mappings
  const scriptModelMap: Record<string, string> = {
    "Gemini": "gemini-script",
    "Cloudflare": "llama-script"
  };

  const audioGenderMap: Record<string, string> = {
    "Nam": "MALE",
    "Nữ": "FEMALE"
  };

  const audioLanguageMap: Record<string, string> = {
    "Tự động": "",
    "English": "en-US",
    "Tiếng Việt": "vi-VN"
  };

  const audioModelMap: Record<string, string> = {
    "AzureTTS": "azure",
    "GoogleTTS": "google"
  };

  const scriptStyleMap: Record<string, string> = {
    "Chuyên nghiệp": "professional",
    "Thân thiện": "friendly",
    "Hài hước": "humorous",
    "Nghiêm túc": "serious",
    "Sáng tạo": "creative"
  };

  const imageStyleMap: Record<string, string> = {
    "Thực tế": "realistic",
    "Hoạt hình": "cartoon",
    "Nghệ thuật": "artistic",
    "Tối giản": "minimalist",
    "Cổ điển": "classic",
    "Anime": "anime",
    "Ghibli": "ghibli",
  };

  const handleGenerateResources = async () => {
    const settings: ResourceSettings = {
      script: {
        style: scriptStyleMap[scriptStyle] || scriptStyle,
        model: scriptModelMap[scriptModel] || scriptModel,
      },
      audio: {
        gender: audioGenderMap[audioGender] || audioGender,
        language: audioLanguageMap[audioLanguage],
        speedRate: audioSpeedRate[0],
        model: audioModelMap[audioModel] || audioModel,
      },
      image: {
        style: imageStyleMap[imageStyle] || imageStyle,
      },
    };
    await onGenerateResources(settings);
  };

  const handleReset = () => {
    setScriptStyle("Chuyên nghiệp");
    setScriptModel("Gemini");
    setAudioGender("Nam");
    setAudioLanguage("Tự động");
    setAudioSpeedRate([1.0]);
    setAudioModel("GoogleTTS");
    setImageStyle("Thực tế");
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#8362E5]" />
          Cài đặt tài nguyên
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings Grid - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Script Settings */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-800">Kịch bản</h3>
            </div>
          
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phong cách</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                    >
                      {scriptStyle}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {scriptStyles.map((style) => (
                      <DropdownMenuItem
                        key={style}
                        onClick={() => setScriptStyle(style)}
                        className="cursor-pointer hover:bg-[#8362E5]/10"
                      >
                        {style}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mô hình AI</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                    >
                      {scriptModel}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {scriptModels.map((model) => (
                      <DropdownMenuItem
                        key={model}
                        onClick={() => setScriptModel(model)}
                        className="cursor-pointer hover:bg-[#8362E5]/10"
                      >
                        {model}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

            {/* Audio Settings */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-gray-800">Âm thanh</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Giới tính</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                >
                  {audioGender}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                {audioGenders.map((gender) => (
                  <DropdownMenuItem
                  key={gender}
                  onClick={() => setAudioGender(gender)}
                  className="cursor-pointer hover:bg-[#8362E5]/10"
                  >
                  {gender}
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                >
                  {audioLanguage}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                {audioLanguages.map((language) => (
                  <DropdownMenuItem
                  key={language}
                  onClick={() => setAudioLanguage(language)}
                  className="cursor-pointer hover:bg-[#8362E5]/10"
                  >
                  {language}
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              {/* Row 2: Speech Rate and TTS Model */}
              <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Tốc độ nói</label>
              <div className="px-3 py-2 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>0.5x</span>
                <span className="font-medium text-[#8362E5]">{audioSpeedRate[0]}x</span>
                <span>2.0x</span>
                </div>
                <Slider
                value={audioSpeedRate}
                onValueChange={setAudioSpeedRate}
                max={2.0}
                min={0.5}
                step={0.1}
                className="w-full"
                />
              </div>
              </div>

              <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô hình TTS</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                >
                  {audioModel}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                {audioModels.map((model) => (
                  <DropdownMenuItem
                  key={model}
                  onClick={() => setAudioModel(model)}
                  className="cursor-pointer hover:bg-[#8362E5]/10"
                  >
                  {model}
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
            </div>

          {/* Image Settings */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <h3 className="font-medium text-gray-800">Hình ảnh</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phong cách</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 px-3 py-2 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-[#8362E5] focus:border-[#8362E5] focus:ring-2 focus:ring-[#8362E5]/20"
                  >
                    {imageStyle}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {imageStyles.map((style) => (
                    <DropdownMenuItem
                      key={style}
                      onClick={() => setImageStyle(style)}
                      className="cursor-pointer hover:bg-[#8362E5]/10"
                    >
                      {style}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <Button
            onClick={handleGenerateResources}
            disabled={isGenerating}
            className="px-6 text-white py-3 rounded-lg transition-colors font-medium bg-[#8362E5] hover:bg-[#6F4EC8] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            {isGenerating ? (
              <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo...
              </div>
            ) : (
              "Tạo tài nguyên"
            )}
            </Button>
            <Button
            onClick={handleReset}
            variant="outline"
            className="px-6 border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
            >
            Đặt lại mặc định
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}