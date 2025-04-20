import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Forward,
  MoreHorizontal,
  Reply,
  ReplyAll,
  Star,
  StarOff,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AIActionBar from "../ui/AIActionBar";
import { useState } from "react";
import EmailCompose from "./EmailCompose";

interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  preview: string;
  date: string;
  tags: string[];
  starred?: boolean;
}

interface EmailViewProps {
  email: Email;
  onBack: () => void;
  onToggleStar: () => void;
}

const EmailView = ({ email, onBack, onToggleStar }: EmailViewProps) => {
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [replyMode, setReplyMode] = useState<null | 'reply' | 'replyAll' | 'forward'>(null);

  // Mock email details
  const emailDetails = {
    to: "you@company.com",
    cc: [],
    bcc: [],
    content: `
      <p>Hi there,</p>
      <p>${email.preview}</p>
      <p>Let me know if you have any questions or concerns.</p>
      <p>Best regards,<br>${email.sender}</p>
    `,
    attachments: []
  };

  const handleReply = () => {
    setReplyMode('reply');
  };

  const handleReplyAll = () => {
    setReplyMode('replyAll');
  };

  const handleForward = () => {
    setReplyMode('forward');
  };

  const handleCloseCompose = () => {
    setReplyMode(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        
        <div className="flex-1 px-4">
          <h2 className="text-lg font-medium">{email.subject}</h2>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onToggleStar}>
            {email.starred ? (
              <Star size={18} className="fill-amber-400 text-amber-400" />
            ) : (
              <StarOff size={18} />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="" />
                      <AvatarFallback>{email.sender[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{email.sender}</h3>
                        <span className="ml-2 text-xs text-gray-500">&lt;{email.senderEmail}&gt;</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span>To: you@company.com</span>
                        <span className="ml-2">{email.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {email.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className={`tag tag-${tag} mr-2`}>
                        {tag === "urgent" ? "Urgent" : 
                         tag === "meeting" ? "Meeting" :
                         tag === "follow" ? "Follow Up" :
                         tag === "approval" ? "Approval" : "Information"}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: emailDetails.content }} />

                <div className="mt-6 flex items-center flex-wrap gap-2">
                  <Button variant="outline" onClick={handleReply}>
                    <Reply size={16} className="mr-1" />
                    Reply
                  </Button>
                  
                  <Button variant="outline" onClick={handleReplyAll}>
                    <ReplyAll size={16} className="mr-1" />
                    Reply All
                  </Button>
                  
                  <Button variant="outline" onClick={handleForward}>
                    <Forward size={16} className="mr-1" />
                    Forward
                  </Button>
                </div>
              </div>
            </div>
            
            {showAIAssistant && <AIActionBar email={email} />}
          </div>
        </div>
      </div>

      {replyMode === 'reply' && (
        <EmailCompose 
          onClose={handleCloseCompose} 
          replyTo={{
            to: email.senderEmail,
            subject: email.subject,
            originalBody: emailDetails.content.replace(/<[^>]*>/g, ''),
          }}
        />
      )}

      {replyMode === 'replyAll' && (
        <EmailCompose 
          onClose={handleCloseCompose} 
          replyTo={{
            to: email.senderEmail, // In a real app, this would include all recipients
            subject: email.subject,
            originalBody: emailDetails.content.replace(/<[^>]*>/g, ''),
          }}
        />
      )}

      {replyMode === 'forward' && (
        <EmailCompose 
          onClose={handleCloseCompose} 
          replyTo={{
            to: '',
            subject: `Fwd: ${email.subject}`,
            originalBody: emailDetails.content.replace(/<[^>]*>/g, ''),
          }}
        />
      )}
    </div>
  );
};

export default EmailView;
