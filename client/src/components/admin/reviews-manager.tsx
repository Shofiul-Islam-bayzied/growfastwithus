import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Plus, Edit, Trash2, Eye, User, Calendar, ThumbsUp } from "lucide-react";

interface Review {
  id: number;
  customerName: string;
  customerEmail?: string;
  customerCompany?: string;
  rating: number;
  reviewText: string;
  isApproved: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type NewReview = Omit<Review, 'id' | 'createdAt' | 'updatedAt'>;

export default function ReviewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [newReview, setNewReview] = useState<NewReview>({
    customerName: "",
    customerEmail: "",
    customerCompany: "",
    rating: 5,
    reviewText: "",
    isApproved: true,
    isFeatured: false,
    isActive: true,
  });

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
  });

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: (data: NewReview) => apiRequest("/api/admin/reviews", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setIsCreateDialogOpen(false);
      setNewReview({
        customerName: "",
        customerEmail: "",
        customerCompany: "",
        rating: 5,
        reviewText: "",
        isApproved: true,
        isFeatured: false,
        isActive: true,
      });
      toast({ title: "Review created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create review", variant: "destructive" });
    },
  });

  // Update review mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Review> }) =>
      apiRequest(`/api/admin/reviews/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setEditingReview(null);
      toast({ title: "Review updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update review", variant: "destructive" });
    },
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/reviews/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  // Filter reviews
  const filteredReviews = Array.isArray(reviews) ? reviews.filter((review: Review) => {
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "approved" && review.isApproved) ||
      (filterStatus === "pending" && !review.isApproved) ||
      (filterStatus === "featured" && review.isFeatured) ||
      (filterStatus === "active" && review.isActive);

    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;

    return matchesStatus && matchesRating;
  }) : [];

  const handleCreateReview = () => {
    if (!newReview.customerName || !newReview.reviewText) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(newReview);
  };

  const handleUpdateReview = () => {
    if (!editingReview) return;
    updateMutation.mutate({
      id: editingReview.id,
      data: editingReview,
    });
  };

  const handleToggleApproval = (review: Review) => {
    updateMutation.mutate({
      id: review.id,
      data: { isApproved: !review.isApproved },
    });
  };

  const handleToggleFeatured = (review: Review) => {
    updateMutation.mutate({
      id: review.id,
      data: { isFeatured: !review.isFeatured },
    });
  };

  const handleToggleActive = (review: Review) => {
    updateMutation.mutate({
      id: review.id,
      data: { isActive: !review.isActive },
    });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (review: Review) => {
    if (!review.isActive) return <Badge variant="outline" className="text-gray-400 border-gray-400">Inactive</Badge>;
    if (!review.isApproved) return <Badge variant="outline" className="text-orange-400 border-orange-400">Pending</Badge>;
    if (review.isFeatured) return <Badge className="bg-purple-500 text-white">Featured</Badge>;
    return <Badge className="bg-green-500 text-white">Approved</Badge>;
  };

  const getAverageRating = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reviews Manager</h2>
          <p className="text-gray-400">Manage customer reviews and testimonials</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Customer Name *</Label>
                  <Input
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                    placeholder="John Doe"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Customer Email</Label>
                  <Input
                    value={newReview.customerEmail}
                    onChange={(e) => setNewReview({ ...newReview, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Company</Label>
                <Input
                  value={newReview.customerCompany}
                  onChange={(e) => setNewReview({ ...newReview, customerCompany: e.target.value })}
                  placeholder="Acme Corp"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Rating</Label>
                <div className="mt-2">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white">Review Text *</Label>
                <Textarea
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  placeholder="Write the review..."
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newReview.isApproved}
                    onCheckedChange={(checked) => setNewReview({ ...newReview, isApproved: checked })}
                  />
                  <Label className="text-white">Approved</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newReview.isFeatured}
                    onCheckedChange={(checked) => setNewReview({ ...newReview, isFeatured: checked })}
                  />
                  <Label className="text-white">Featured</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newReview.isActive}
                    onCheckedChange={(checked) => setNewReview({ ...newReview, isActive: checked })}
                  />
                  <Label className="text-white">Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateReview}
                  disabled={createMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Create Review
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold text-white">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-white">{getAverageRating()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(reviews) ? reviews.filter((r: Review) => r.isApproved).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Featured</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(reviews) ? reviews.filter((r: Review) => r.isFeatured).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="text-white border-white/20">
              {filteredReviews.length} of {reviews.length} reviews
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="bg-black/30 border-white/20">
            <CardContent className="p-8 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
              <p className="text-gray-400">
                {filterStatus !== "all" || filterRating !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first review to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review: Review) => (
            <Card key={review.id} className="bg-black/30 border-white/20">
              <CardContent className="p-6">
                {editingReview?.id === review.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Customer Name</Label>
                        <Input
                          value={editingReview.customerName}
                          onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Customer Email</Label>
                        <Input
                          value={editingReview.customerEmail}
                          onChange={(e) => setEditingReview({ ...editingReview, customerEmail: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Company</Label>
                      <Input
                        value={editingReview.customerCompany}
                        onChange={(e) => setEditingReview({ ...editingReview, customerCompany: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Rating</Label>
                      <div className="mt-2">
                        {renderStars(editingReview.rating, true, (rating) => 
                          setEditingReview({ ...editingReview, rating })
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Review Text</Label>
                      <Textarea
                        value={editingReview.reviewText}
                        onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                        className="bg-white/10 border-white/20 text-white min-h-[120px]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingReview.isApproved}
                          onCheckedChange={(checked) => setEditingReview({ ...editingReview, isApproved: checked })}
                        />
                        <Label className="text-white">Approved</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingReview.isFeatured}
                          onCheckedChange={(checked) => setEditingReview({ ...editingReview, isFeatured: checked })}
                        />
                        <Label className="text-white">Featured</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingReview.isActive}
                          onCheckedChange={(checked) => setEditingReview({ ...editingReview, isActive: checked })}
                        />
                        <Label className="text-white">Active</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateReview}
                        disabled={updateMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditingReview(null)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">{review.customerName}</h3>
                          {getStatusBadge(review)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          {renderStars(review.rating)}
                          {review.customerCompany && (
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {review.customerCompany}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-gray-300 leading-relaxed">{review.reviewText}</p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleToggleApproval(review)}
                          variant="outline"
                          size="sm"
                          className={`border-white/20 hover:bg-white/10 ${
                            review.isApproved ? "text-green-400" : "text-orange-400"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => handleToggleFeatured(review)}
                          variant="outline"
                          size="sm"
                          className={`border-white/20 hover:bg-white/10 ${
                            review.isFeatured ? "text-purple-400" : "text-white"
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => setEditingReview(review)}
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => deleteMutation.mutate(review.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}