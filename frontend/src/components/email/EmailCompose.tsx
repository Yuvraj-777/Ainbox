import { useState, useRef, useEffect } from "react";
import { X, Paperclip, Send, Save, Trash } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface EmailComposeProps {
  onClose: () => void;
  draftId?: string;
  replyTo?: {
    to: string;
    subject: string;
    originalBody?: string;
  };
}

const EmailCompose = ({ onClose, draftId, replyTo }: EmailComposeProps) => {
  const [to, setTo] = useState(replyTo?.to || "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : "");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load draft if draftId is provided
  useEffect(() => {
    const loadDraft = async () => {
      if (draftId) {
        try {
          const res = await axios.get(`http://localhost:5000/api/email/draft/${draftId}`, {
            withCredentials: true,
          });
          
          const draft = res.data;
          setTo(draft.to || "");
          setCc(draft.cc || "");
          setBcc(draft.bcc || "");
          setSubject(draft.subject || "");
          setBody(draft.body || "");
          setShowCcBcc(!!draft.cc || !!draft.bcc);
          // Note: attachments would need additional handling
        } catch (error) {
          console.error("Failed to load draft:", error);
          toast({
            title: "Error",
            description: "Failed to load draft email",
            variant: "destructive",
          });
        }
      } else if (replyTo?.originalBody) {
        // Set up reply format with quoted original message
        setBody(`\n\n-------- Original Message --------\n${replyTo.originalBody}`);
      }
    };

    loadDraft();
  }, [draftId, replyTo]);

  const handleSendEmail = async () => {
    if (!to || !subject || !body) {
      toast({
        title: "Incomplete Email",
        description: "Please fill in the recipient, subject, and body fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      await axios.post(
        "http://localhost:5000/api/email/send",
        {
          to,
          cc: cc || undefined,
          bcc: bcc || undefined,
          subject,
          body,
          // Handle attachments if needed
        },
        { withCredentials: true }
      );

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully",
      });

      // If this was a draft, delete it after sending
      if (draftId) {
        try {
          await axios.delete(`http://localhost:5000/api/email/draft/${draftId}`, {
            withCredentials: true,
          });
        } catch (error) {
          console.error("Failed to delete draft after sending:", error);
        }
      }

      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      
      // Show more specific error message if available
      let errorMessage = "Failed to send email. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = `Error: ${error.response.data.error}`;
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please check if you're logged in with the correct permissions.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Email Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!to && !subject && !body) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      await axios.post(
        "http://localhost:5000/api/email/draft",
        {
          draftId,
          to,
          cc: cc || undefined,
          bcc: bcc || undefined,
          subject,
          body,
          // Handle attachments if needed
        },
        { withCredentials: true }
      );

      toast({
        title: "Draft Saved",
        description: "Your draft has been saved",
      });

      onClose();
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Card className="fixed bottom-4 right-4 w-full max-w-2xl shadow-lg z-50">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Compose Email</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2 space-y-3">
        <div>
          <div className="flex items-center">
            <span className="w-12 text-sm text-gray-500">To:</span>
            <Input
              className="flex-1 border-0 focus-visible:ring-0 px-0"
              placeholder="Recipients"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            {!showCcBcc && (
              <Button
                variant="link"
                className="text-xs text-muted-foreground"
                onClick={() => setShowCcBcc(true)}
              >
                Cc/Bcc
              </Button>
            )}
          </div>
        </div>

        {showCcBcc && (
          <>
            <div className="flex items-center">
              <span className="w-12 text-sm text-gray-500">Cc:</span>
              <Input
                className="flex-1 border-0 focus-visible:ring-0 px-0"
                placeholder="Carbon copy recipients"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="w-12 text-sm text-gray-500">Bcc:</span>
              <Input
                className="flex-1 border-0 focus-visible:ring-0 px-0"
                placeholder="Blind carbon copy recipients"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex items-center">
          <span className="w-12 text-sm text-gray-500">Subject:</span>
          <Input
            className="flex-1 border-0 focus-visible:ring-0 px-0"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <Textarea
          className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
          placeholder="Write your message here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {attachments.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Attachments</div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-muted rounded-md p-1 pr-2 text-sm"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeAttachment(index)}
                  >
                    <X size={12} />
                  </Button>
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-2 flex justify-between">
        <div className="flex gap-2">
          <input
            title="Attach file"
            placeholder="Attach file"
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <Button variant="ghost" size="sm" onClick={handleAttachFile}>
            <Paperclip size={16} className="mr-2" />
            Attach
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending} size="sm">
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmailCompose; 