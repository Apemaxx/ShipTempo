import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  FileText,
  User,
  Clock,
  Mail,
  Paperclip,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  avatar: string;
}

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface Template {
  id: string;
  title: string;
  content: string;
}

interface EmailAccount {
  id: string;
  provider: "gmail" | "outlook";
  email: string;
  connected: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface CommunicationHubProps {
  shipmentId?: string;
  messages?: Message[];
  notes?: Note[];
  templates?: Template[];
  emailAccounts?: EmailAccount[];
  documents?: { id: string; name: string; type: string; date: string }[];
}

const CommunicationHub = ({
  shipmentId = "SHP-12345",
  messages = [
    {
      id: "1",
      sender: "John Smith",
      content:
        "Hello, I wanted to check on the status of my shipment. Has it cleared customs yet?",
      timestamp: "2023-06-15T10:30:00",
      isInternal: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      content:
        "I've checked with our customs team and your shipment has been cleared. It should be in transit to the final destination now.",
      timestamp: "2023-06-15T11:45:00",
      isInternal: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: "3",
      sender: "Mike Wilson",
      content:
        "Need to follow up with the carrier about the ETA. Customer seems concerned.",
      timestamp: "2023-06-15T13:20:00",
      isInternal: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
  ],
  notes = [
    {
      id: "1",
      author: "Mike Wilson",
      content:
        "Customer requested expedited processing once customs is cleared.",
      timestamp: "2023-06-14T09:15:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    {
      id: "2",
      author: "Sarah Johnson",
      content: "Contacted carrier to confirm delivery window for next Tuesday.",
      timestamp: "2023-06-15T14:30:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  ],
  templates = [
    {
      id: "1",
      title: "Customs Clearance Update",
      content:
        "Dear [Customer Name], We're pleased to inform you that your shipment [Shipment ID] has cleared customs and is now in transit to the final destination. The estimated delivery date is [Delivery Date]. Please let us know if you have any questions.",
    },
    {
      id: "2",
      title: "Delivery Confirmation Request",
      content:
        "Dear [Customer Name], Your shipment [Shipment ID] is scheduled for delivery on [Delivery Date]. Please confirm if someone will be available to receive the shipment at the destination address.",
    },
    {
      id: "3",
      title: "Delay Notification",
      content:
        "Dear [Customer Name], We regret to inform you that your shipment [Shipment ID] has encountered a delay due to [Reason]. The new estimated delivery date is [New Delivery Date]. We apologize for any inconvenience this may cause.",
    },
  ],
  emailAccounts = [
    {
      id: "1",
      provider: "gmail",
      email: "shipping@example.com",
      connected: true,
    },
    {
      id: "2",
      provider: "outlook",
      email: "logistics@example.com",
      connected: false,
    },
  ],
  documents = [
    {
      id: "1",
      name: "Commercial Invoice.pdf",
      type: "invoice",
      date: "2023-06-10T09:00:00",
    },
    {
      id: "2",
      name: "Bill of Lading.pdf",
      type: "bol",
      date: "2023-06-12T14:30:00",
    },
    {
      id: "3",
      name: "Packing List.xlsx",
      type: "packing",
      date: "2023-06-11T11:15:00",
    },
  ],
}: CommunicationHubProps) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [selectedEmailAccount, setSelectedEmailAccount] =
    useState<EmailAccount | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showConnectAccount, setShowConnectAccount] = useState(false);
  const [newEmailProvider, setNewEmailProvider] = useState<"gmail" | "outlook">(
    "gmail",
  );
  const [newEmailAddress, setNewEmailAddress] = useState("");
  const [newEmailPassword, setNewEmailPassword] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    // Logic to send message would go here
    setNewMessage("");
    setAttachments([]);
    setShowEmailForm(false);
  };

  const handleAddNote = () => {
    if (newNote.trim() === "") return;
    // Logic to add note would go here
    setNewNote("");
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setNewMessage(template.content);
  };

  const handleConnectEmailAccount = () => {
    // In a real implementation, this would initiate OAuth flow with the selected provider
    console.log(`Connecting ${newEmailProvider} account: ${newEmailAddress}`);
    setShowConnectAccount(false);
    // Simulate successful connection
    const newAccount: EmailAccount = {
      id: `${Date.now()}`,
      provider: newEmailProvider,
      email: newEmailAddress,
      connected: true,
    };
    // In a real app, you would update this in your backend
    emailAccounts.push(newAccount);
    setSelectedEmailAccount(newAccount);
    setNewEmailAddress("");
    setNewEmailPassword("");
  };

  const handleAddAttachment = (document: {
    id: string;
    name: string;
    type: string;
    date: string;
  }) => {
    const newAttachment: Attachment = {
      id: document.id,
      name: document.name,
      size: "1.2 MB", // This would be actual file size in a real app
      type: document.type,
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleSendEmail = () => {
    if (!selectedEmailAccount || !emailSubject || newMessage.trim() === "") {
      return;
    }

    console.log(`Sending email from ${selectedEmailAccount.email}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Message: ${newMessage}`);
    console.log(`Attachments: ${attachments.map((a) => a.name).join(", ")}`);

    // In a real app, you would send this to your backend to process
    // Reset form
    setEmailSubject("");
    setNewMessage("");
    setAttachments([]);
    setShowEmailForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communication Hub
        </CardTitle>
      </CardHeader>

      <Tabs
        defaultValue="messages"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="notes">Internal Notes</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="messages" className="flex-1 flex flex-col p-4 pt-2">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <Card
                  key={message.id}
                  className={cn(
                    "overflow-hidden",
                    message.isInternal ? "bg-blue-50" : "bg-white",
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border">
                        <img src={message.avatar} alt={message.sender} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium flex items-center gap-1">
                            {message.sender}
                            {message.isInternal && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Internal
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-3" />

          <div className="mt-auto">
            <Textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] resize-none mb-2"
            />
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" /> Attach
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-1" /> CC
                </Button>
              </div>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 flex flex-col p-4 pt-2">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border">
                        <img src={note.avatar} alt={note.author} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">{note.author}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-3" />

          <div className="mt-auto">
            <Textarea
              placeholder="Add an internal note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none mb-2"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddNote}>Add Note</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="templates"
          className="flex-1 flex flex-col p-4 pt-2"
        >
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-primary"
                      : "",
                  )}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-1">{template.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-3" />

          <div className="flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => {
                if (selectedTemplate) {
                  setActiveTab("messages");
                }
              }}
              disabled={!selectedTemplate}
            >
              Use Selected Template
            </Button>
            <Button variant="outline">Create New Template</Button>
          </div>
        </TabsContent>

        <TabsContent value="email" className="flex-1 flex flex-col p-4 pt-2">
          {showEmailForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Compose Email</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label className="w-20">From:</Label>
                  <Select
                    value={selectedEmailAccount?.id}
                    onValueChange={(value) => {
                      const account = emailAccounts.find(
                        (acc) => acc.id === value,
                      );
                      setSelectedEmailAccount(account || null);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select email account" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailAccounts
                        .filter((acc) => acc.connected)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.email} ({account.provider})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="w-20">To:</Label>
                  <Input placeholder="recipient@example.com" />
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="w-20">Subject:</Label>
                  <Input
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <Textarea
                  placeholder="Type your email message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[150px] resize-none"
                />

                {attachments.length > 0 && (
                  <div className="border rounded-md p-2">
                    <h4 className="text-sm font-medium mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({attachment.size})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveAttachment(attachment.id)
                            }
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Paperclip className="h-4 w-4 mr-1" /> Attach Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Documents to Attach</DialogTitle>
                        <DialogDescription>
                          Choose from available shipment documents to attach to
                          your email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[300px] overflow-y-auto">
                        <div className="space-y-2">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                              onClick={() => handleAddAttachment(doc)}
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(doc.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Paperclip className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleSendEmail}
                    disabled={
                      !selectedEmailAccount ||
                      !emailSubject ||
                      newMessage.trim() === ""
                    }
                  >
                    <Send className="h-4 w-4 mr-1" /> Send Email
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Accounts</h3>
                <Dialog
                  open={showConnectAccount}
                  onOpenChange={setShowConnectAccount}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> Connect Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect Email Account</DialogTitle>
                      <DialogDescription>
                        Connect your Gmail or Outlook account to send emails
                        directly from the platform.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label>Email Provider</Label>
                        <Select
                          value={newEmailProvider}
                          onValueChange={(value: "gmail" | "outlook") =>
                            setNewEmailProvider(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gmail">Gmail</SelectItem>
                            <SelectItem value="outlook">Outlook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          placeholder="your.email@example.com"
                          value={newEmailAddress}
                          onChange={(e) => setNewEmailAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={newEmailPassword}
                          onChange={(e) => setNewEmailPassword(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        In a production environment, this would use OAuth for
                        secure authentication.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowConnectAccount(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConnectEmailAccount}
                        disabled={!newEmailAddress || !newEmailPassword}
                      >
                        Connect
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {emailAccounts.map((account) => (
                  <Card key={account.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <img
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${account.email}`}
                              alt={account.email}
                            />
                          </Avatar>
                          <div>
                            <p className="font-medium">{account.email}</p>
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  account.provider === "gmail"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {account.provider}
                              </Badge>
                              <Badge
                                variant={
                                  account.connected ? "success" : "destructive"
                                }
                                className="ml-2"
                              >
                                {account.connected
                                  ? "Connected"
                                  : "Disconnected"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!account.connected}
                                onClick={() => {
                                  setSelectedEmailAccount(account);
                                  setShowEmailForm(true);
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Compose Email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {emailAccounts.some((acc) => acc.connected) && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => {
                      const connectedAccount = emailAccounts.find(
                        (acc) => acc.connected,
                      );
                      if (connectedAccount) {
                        setSelectedEmailAccount(connectedAccount);
                        setShowEmailForm(true);
                      }
                    }}
                  >
                    <Mail className="h-4 w-4 mr-1" /> Compose New Email
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationHub;
