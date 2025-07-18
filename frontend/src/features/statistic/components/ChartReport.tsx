"use client";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUpIcon, BarChartIcon, PieChartIcon } from "lucide-react";
import { useListVideos } from "@/features/videos/api/video";
import { getAllVideoStats } from "@/features/statistic/api/statistic";
import { useQuery } from "@tanstack/react-query";

export default function ChartReport() {
  const { data: videos } = useListVideos();
  const { data: videoStats } = useQuery({
    queryKey: ['videoStats'],
    queryFn: getAllVideoStats,
  });

  const viewsData = useMemo(() => {
    if (!videos) return [];
    
    const videosByMonth = videos.reduce((acc, video) => {
      const date = new Date(video.createdAt);
      const monthKey = `T${date.getMonth() + 1}`;
      if (!acc[monthKey]) acc[monthKey] = 0;
      acc[monthKey]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(videosByMonth).map(([month, count]) => ({
      name: month,
      youtube: count
    }));
  }, [videos]);

  const engagementData = useMemo(() => {
    if (!videoStats || videoStats.length === 0) return [];
    
    const totalEngagement = videoStats.reduce((acc, stat) => {
      acc.likes += stat.likes;
      acc.comments += stat.comments;
      acc.views += stat.views;
      return acc;
    }, { likes: 0, comments: 0, views: 0 });

    const total = totalEngagement.likes + totalEngagement.comments;
    if (total === 0) return [];

    return [
      { name: 'Likes', value: Math.round((totalEngagement.likes / total) * 100), color: '#3b82f6' },
      { name: 'Comments', value: Math.round((totalEngagement.comments / total) * 100), color: '#10b981' },
      { name: 'Views Ratio', value: Math.round((totalEngagement.views / (totalEngagement.views + total)) * 100), color: '#f59e0b' },
    ];
  }, [videoStats]);

  const performanceMetrics = useMemo(() => {
    if (!videos || !videoStats) return [];
    
    const completedVideos = videos.filter(v => v.status === 'COMPLETED').length;
    const youtubeVideos = videos.filter(v => v.platform === 'YOUTUBE').length;
    const avgViews = videoStats.length > 0 ? videoStats.reduce((sum, stat) => sum + stat.views, 0) / videoStats.length : 0;
    const avgLikes = videoStats.length > 0 ? videoStats.reduce((sum, stat) => sum + stat.likes, 0) / videoStats.length : 0;
    
    return [
      { metric: 'Video Completion Rate', value: Math.round((completedVideos / videos.length) * 100), color: '#ef4444', target: 90 },
      { metric: 'YouTube Upload Rate', value: Math.round((youtubeVideos / videos.length) * 100), color: '#10b981', target: 80 },
      { metric: 'Average Views Performance', value: Math.min(Math.round((avgViews / 1000) * 100), 100), color: '#3b82f6', target: 70 },
      { metric: 'Engagement Quality', value: Math.min(Math.round((avgLikes / 100) * 100), 100), color: '#f59e0b', target: 60 },
    ];
  }, [videos, videoStats]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; dataKey: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
          <BarChartIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Báo cáo chi tiết</h3>
          <p className="text-sm text-gray-600">Phân tích dữ liệu đa chiều</p>
        </div>
      </div>

      <Tabs defaultValue="views" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="views" className="flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4" />
            Lượt xem
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Tương tác
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Hiệu suất
          </TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="youtube" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="youtube" stackId="1" stroke="#ef4444" fill="url(#youtube)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>YouTube</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {engagementData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${metric.value}%`, 
                      backgroundColor: metric.color,
                    }}
                  ></div>
                  <div 
                    className="absolute top-0 h-3 w-1 bg-gray-600 rounded-full"
                    style={{ left: `${metric.target}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {metric.value}%</span>
                  <span>Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700 font-medium text-sm">
              📈 +2.1% tăng trưởng tài nguyên server so với tháng trước
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
