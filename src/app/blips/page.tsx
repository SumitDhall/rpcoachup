
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Music2, Share2, Heart, MessageCircle, X, Volume2, VolumeX, Send, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { VideoPlayer } from "@/features/video/components/VideoPlayer";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SAMPLE_VIDEOS = [
  "/videos/v1.mp4",
  "/videos/v2.mp4",
  "/videos/v3.mp4",
  "/videos/v4.mp4"
];

const MOCK_BLIPS = [
  {
    id: 1,
    title: "Urban Flow Night",
    dancer: "Julianne Hough",
    description: "Highlights from our latest street dance battle in downtown Los Angeles.",
    location: "Los Angeles, CA",
    date: "Oct 24, 2024",
    duration: "0:45",
    videoUrl: SAMPLE_VIDEOS[0],
  },
  {
    id: 2,
    title: "Salsa Social Highlights",
    dancer: "Derek Hough",
    description: "The energy was electric at the Summer Salsa Social. Best moments captured.",
    location: "Miami, FL",
    date: "Sep 12, 2024",
    duration: "0:58",
    videoUrl: SAMPLE_VIDEOS[1],
  },
  {
    id: 3,
    title: "Contemporary Showcase",
    dancer: "Misty Copeland",
    description: "A beautiful expression of movement from the annual Contemporary Arts festival.",
    location: "New York, NY",
    date: "Aug 05, 2024",
    duration: "0:32",
    videoUrl: SAMPLE_VIDEOS[2],
  },
  {
    id: 4,
    title: "Ballet Rehearsal Sessions",
    dancer: "Les Twins",
    description: "Behind the scenes look at the precision and grace of our lead principal dancers.",
    location: "London, UK",
    date: "Jul 20, 2024",
    duration: "0:55",
    videoUrl: SAMPLE_VIDEOS[3],
  }
];

const MOCK_COMMENTS = [
  { id: 1, user: "Sarah", text: "Incredible rhythm! 🔥", time: "2m ago" },
  { id: 2, user: "Alex", text: "The footwork here is insane.", time: "5m ago" },
  { id: 3, user: "Elena", text: "Love the lighting on this set.", time: "12m ago" },
  { id: 4, user: "Marcus", text: "Can't wait to see more from this dancer.", time: "1h ago" },
];

interface ReelItemProps {
  blip: typeof MOCK_BLIPS[0];
  isMuted: boolean;
  onToggleMute: () => void;
}

function ReelItem({ blip, isMuted, onToggleMute }: ReelItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: "You",
      text: newComment,
      time: "Just now"
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="h-screen w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <VideoPlayer
        url={blip.videoUrl}
        muted={isMuted}
        loop
        autoplay
        controls={false}
        className="absolute inset-0 h-full w-full"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />
      
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center pointer-events-auto z-20">
        <div className="flex flex-col items-center gap-1 group">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onToggleMute}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all"
          >
            {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white">
            {isMuted ? 'Muted' : 'Sound'}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsLiked(!isLiked)}
            className={`h-12 w-12 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-primary/40 text-primary' : 'bg-white/10 hover:bg-primary/20 hover:text-primary'}`}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Like</span>
        </div>

        <Drawer shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all">
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Chat</span>
            </div>
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay className="bg-black/40 backdrop-blur-none" />
            <DrawerContent className="glass-card border-white/10 bg-black/90 text-foreground h-[75vh] md:h-[60vh] outline-none">
              <DrawerHeader className="border-b border-white/5 flex items-center justify-between px-6 py-4">
                <DrawerTitle className="text-xl font-black italic uppercase tracking-tighter">
                  Comments
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={`https://picsum.photos/seed/${comment.user}/100/100`} />
                        <AvatarFallback>{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-primary">{comment.user}</span>
                          <span className="text-[9px] font-bold opacity-40 uppercase">{comment.time}</span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Input 
                    placeholder="Add a rhythm to the chat..." 
                    className="flex-1 bg-white/5 border-white/10 rounded-2xl h-12 text-sm focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-white/30"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button 
                    size="icon" 
                    className="h-12 w-12 rounded-2xl bg-vibrant-gradient text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>

        <div className="flex flex-col items-center gap-1 group">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all">
            <Share2 className="h-6 w-6 text-white" />
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Share</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 right-20 space-y-4 pointer-events-none z-20">
        <div className="space-y-3">
          <div className="flex items-center gap-3 pointer-events-auto">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary drop-shadow-md">
              @{blip.dancer.replace(/\s+/g, '').toLowerCase()}
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`h-7 px-4 rounded-full border-primary/40 text-[9px] font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-primary text-background' : 'bg-transparent text-primary hover:bg-primary/10'}`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
          
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
            {blip.title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md">
              <Clock className="w-3 h-3 mr-1" />
              {blip.duration}
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-primary" />
              {blip.location}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed max-w-md drop-shadow-md">
          {blip.description}
        </p>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-spin-slow">
            <Music2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="overflow-hidden whitespace-nowrap w-40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary animate-marquee inline-block">
              Original Audio • {blip.title} Rhythms • Dance Realm exclusive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlipsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, isLoading]);

  const toggleMute = () => setIsMuted(prev => !prev);

  const handleAuthRedirect = () => {
    setShowAuthDialog(false);
    router.push('/login');
  };

  if (isLoading || (!user && !showAuthDialog)) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
           <Lock className="h-12 w-12 text-primary animate-pulse mx-auto" />
           <p className="text-sm font-black uppercase tracking-widest text-primary">Synchronizing Rhythms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
      {MOCK_BLIPS.map((blip) => (
        <ReelItem 
          key={blip.id} 
          blip={blip} 
          isMuted={isMuted} 
          onToggleMute={toggleMute}
        />
      ))}

      <Dialog open={showAuthDialog} onOpenChange={(open) => { if (!open) handleAuthRedirect(); }}>
        <DialogContent className="p-[2px] bg-vibrant-gradient border-none max-w-md rounded-[2.5rem] overflow-hidden">
          <div className="bg-black/95 text-white p-8 rounded-[calc(2.5rem-2px)] flex flex-col gap-6">
            <DialogHeader className="space-y-4 text-center items-center">
              <div className="h-20 w-20 rounded-[1.5rem] bg-vibrant-gradient flex items-center justify-center shadow-2xl shadow-primary/20 animate-in zoom-in-50 duration-500">
                <Sparkles className="h-10 w-10 text-white fill-white/20" />
              </div>
              <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
                Sign in Required
              </DialogTitle>
              <DialogDescription className="text-sm text-white/60 leading-relaxed font-medium">
                Join the Dance Realm community to witness these incredible rhythms. Please sign in or register to check the BLIPS and connect with artists worldwide.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-2">
              <Button 
                onClick={handleAuthRedirect}
                className="w-1/2 h-12 rounded-2xl bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all border-none"
              >
                Got It
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
