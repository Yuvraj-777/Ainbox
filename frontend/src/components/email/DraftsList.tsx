import { useState } from "react";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailDrafts } from "@/hooks/useEmailDrafts";
import EmailCompose from "./EmailCompose";
import { formatDistanceToNow } from "date-fns";

const DraftsList = () => {
  const { drafts, loading, error, deleteDraft, fetchDrafts } = useEmailDrafts();
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  const handleEditDraft = (draftId: string) => {
    setEditingDraftId(draftId);
  };

  const handleDeleteDraft = async (draftId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this draft?");
    if (confirmed) {
      const success = await deleteDraft(draftId);
      if (success) {
        fetchDrafts(); // Refresh the list
      }
    }
  };

  const handleCloseCompose = () => {
    setEditingDraftId(null);
    fetchDrafts(); // Refresh the list after closing compose
  };

  if (loading) return <div className="p-4 text-center">Loading drafts...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (drafts.length === 0) return <div className="p-4 text-center">No drafts found</div>;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Drafts</h2>
      
      {drafts.map((draft) => (
        <Card key={draft.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="py-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">
                  {draft.subject || "(No subject)"}
                </CardTitle>
                <div className="text-sm text-gray-500 mt-1">
                  To: {draft.to || "(No recipient)"}
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditDraft(draft.id)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteDraft(draft.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-sm text-gray-600 line-clamp-2">
              {draft.body || "(No content)"}
            </div>
            <div className="text-xs text-gray-400 mt-2 flex items-center">
              <Calendar size={12} className="mr-1" />
              {draft.lastModified ? 
                formatDistanceToNow(new Date(draft.lastModified), { addSuffix: true }) : 
                "Unknown time"}
            </div>
          </CardContent>
        </Card>
      ))}

      {editingDraftId && (
        <EmailCompose
          draftId={editingDraftId}
          onClose={handleCloseCompose}
        />
      )}
    </div>
  );
};

export default DraftsList; 