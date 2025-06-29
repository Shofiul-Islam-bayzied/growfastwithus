import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Star, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Review {
  id: number;
  name: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export function ReviewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: any) =>
      apiRequest("/api/admin/reviews", "POST", reviewData),
    onSuccess: () => {
      toast({ title: "Review created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setIsAddingReview(false);
    },
    onError: () => {
      toast({ title: "Failed to create review", variant: "destructive" });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, ...reviewData }: any) =>
      apiRequest(`/api/admin/reviews/${id}`, "PUT", reviewData),
    onSuccess: () => {
      toast({ title: "Review updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setEditingReview(null);
    },
    onError: () => {
      toast({ title: "Failed to update review", variant: "destructive" });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/reviews/${id}`, "DELETE"),
    onSuccess: () => {
      toast({ title: "Review deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  const toggleReviewStatus = (review: Review) => {
    updateReviewMutation.mutate({
      id: review.id,
      isActive: !review.isActive
    });
  };

  const ReviewForm = ({ review, onSubmit, onCancel }: {
    review?: Review;
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: review?.name || '',
      company: review?.company || '',
      position: review?.position || '',
      content: review?.content || '',
      rating: review?.rating || 5,
      image: review?.image || '',
      isActive: review?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(review ? { id: review.id, ...formData } : formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select 
              value={formData.rating.toString()} 
              onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="image">Profile Image URL</Label>
          <Input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/profile.jpg"
          />
        </div>

        <div>
          <Label htmlFor="content">Review Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {review ? "Update Review" : "Create Review"}
          </Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <p className="text-gray-600">Manage customer reviews and testimonials</p>
        </div>
        <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Review</DialogTitle>
            </DialogHeader>
            <ReviewForm
              onSubmit={(data) => createReviewMutation.mutate(data)}
              onCancel={() => setIsAddingReview(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6">
        {reviews?.map((review: Review) => (
          <Card key={review.id} className={!review.isActive ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  {review.image && (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    {review.company && (
                      <p className="text-sm text-gray-600">
                        {review.position && `${review.position}, `}{review.company}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleReviewStatus(review)}
                  >
                    {review.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingReview(review)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this review?")) {
                        deleteReviewMutation.mutate(review.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 italic">"{review.content}"</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {(!reviews || reviews.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">Start building trust by adding customer testimonials</p>
              <Button onClick={() => setIsAddingReview(true)}>
                Add Your First Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Review Dialog */}
      {editingReview && (
        <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
            </DialogHeader>
            <ReviewForm
              review={editingReview}
              onSubmit={(data) => updateReviewMutation.mutate(data)}
              onCancel={() => setEditingReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}