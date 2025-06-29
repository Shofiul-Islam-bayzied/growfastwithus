import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Building,
  User,
  Mail,
  Phone
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  industry: string;
  businessSize: string;
  painPoints: string[];
  timeSpent: number;
  message: string;
  createdAt: string;
}

export function ContactsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["/api/contacts"],
  });

  const filteredContacts = contacts?.filter((contact: Contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "recent" && new Date(contact.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterBy === "business" && contact.businessSize) ||
      (filterBy === "high-value" && contact.timeSpent > 40);

    return matchesSearch && matchesFilter;
  }) || [];

  const exportContacts = () => {
    const csvContent = [
      ["Name", "Email", "Company", "Phone", "Industry", "Business Size", "Pain Points", "Time Spent", "Message", "Date"].join(","),
      ...filteredContacts.map((contact: Contact) => [
        contact.name,
        contact.email,
        contact.company || "",
        contact.phone || "",
        contact.industry || "",
        contact.businessSize || "",
        contact.painPoints?.join("; ") || "",
        contact.timeSpent || "",
        `"${contact.message || ""}"`,
        new Date(contact.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getBusinessSizeBadge = (size: string) => {
    const colors = {
      "Small Business (1-10 employees)": "bg-green-100 text-green-800",
      "Medium Business (11-50 employees)": "bg-blue-100 text-blue-800",
      "Large Business (51-200 employees)": "bg-purple-100 text-purple-800",
      "Enterprise (200+ employees)": "bg-orange-100 text-orange-800",
    };
    return colors[size as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contacts Management</h2>
          <p className="text-gray-600">View and manage customer inquiries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportContacts} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">{contacts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">
                  {contacts?.filter((c: Contact) => 
                    new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Enterprise</p>
                <p className="text-2xl font-bold">
                  {contacts?.filter((c: Contact) => 
                    c.businessSize?.includes("Enterprise")
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">High Value</p>
                <p className="text-2xl font-bold">
                  {contacts?.filter((c: Contact) => c.timeSpent > 40).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Contacts</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Filter By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="mt-1 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="recent">Recent (7 days)</SelectItem>
                  <SelectItem value="business">Has Business Info</SelectItem>
                  <SelectItem value="high-value">High Value (40+ hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-gray-600">
                {searchTerm || filterBy !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Contact submissions will appear here"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact: Contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {contact.name}
                          {contact.businessSize && (
                            <Badge className={getBusinessSizeBadge(contact.businessSize)}>
                              {contact.businessSize.split(" ")[0]}
                            </Badge>
                          )}
                        </h3>
                        {contact.company && (
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <Building className="w-4 h-4" />
                            {contact.company}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      
                      {contact.industry && (
                        <div className="text-sm">
                          <span className="text-gray-600">Industry:</span> {contact.industry}
                        </div>
                      )}
                      
                      {contact.timeSpent && (
                        <div className="text-sm">
                          <span className="text-gray-600">Time Spent:</span> {contact.timeSpent} hours/week
                        </div>
                      )}
                    </div>

                    {contact.painPoints && contact.painPoints.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Pain Points:</p>
                        <div className="flex flex-wrap gap-1">
                          {contact.painPoints.map((painPoint, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {painPoint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {contact.message && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Message:</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {contact.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Detail Dialog */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                {selectedContact.company && (
                  <div>
                    <Label>Company</Label>
                    <p className="font-medium">{selectedContact.company}</p>
                  </div>
                )}
                {selectedContact.phone && (
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                {selectedContact.industry && (
                  <div>
                    <Label>Industry</Label>
                    <p className="font-medium">{selectedContact.industry}</p>
                  </div>
                )}
                {selectedContact.businessSize && (
                  <div>
                    <Label>Business Size</Label>
                    <p className="font-medium">{selectedContact.businessSize}</p>
                  </div>
                )}
              </div>

              {selectedContact.painPoints && selectedContact.painPoints.length > 0 && (
                <div>
                  <Label>Pain Points</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedContact.painPoints.map((painPoint, index) => (
                      <Badge key={index} variant="outline">
                        {painPoint}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedContact.timeSpent && (
                <div>
                  <Label>Weekly Time Spent on Manual Tasks</Label>
                  <p className="font-medium">{selectedContact.timeSpent} hours</p>
                </div>
              )}

              {selectedContact.message && (
                <div>
                  <Label>Message</Label>
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{selectedContact.message}</p>
                </div>
              )}

              <div>
                <Label>Submitted Date</Label>
                <p className="font-medium">{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button asChild>
                  <a href={`mailto:${selectedContact.email}?subject=Re: Your automation inquiry`}>
                    Reply via Email
                  </a>
                </Button>
                {selectedContact.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedContact.phone}`}>
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}