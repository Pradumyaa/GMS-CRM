import {
  ChevronDownCircleIcon,
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
  SearchCheckIcon,
  Settings2Icon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const navigationItems = [
  { icon: "key-square", label: "Dashboard", path: "/" },
  { icon: "3d-square", label: "Product", path: "/product" },
  { icon: "user-square", label: "Profile", path: "/profile" },
  { icon: "wallet-money", label: "Income", path: "/income" },
  {
    icon: "discount-shape",
    label: "Organisation",
    path: "/organisation",
    active: true,
  },
  { icon: "message-question", label: "Help", path: "/help" },
];

const employees = [
  {
    name: "Sriram",
    branch: "Admin",
    phone: "+91 1234567890",
    email: "jane@microsoft.com",
    location: "Chennai",
    status: "Active",
  },
  {
    name: "Manoj J Pradhan",
    branch: "Sales",
    phone: "+91 1234567890",
    email: "floyd@yahoo.com",
    location: "Chennai",
    status: "Inactive",
  },
  // ... Add remaining employees
];

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#fafbff]">
      <aside className="w-[306px] bg-white shadow-lg">
        <div className="p-7 space-y-8">
          <div className="flex items-center gap-3">
            <Settings2Icon className="w-9 h-9" />
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>

          <nav className="space-y-4">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start ${
                  item.active ? "bg-[#5932ea] text-white" : "text-[#9197b3]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <img
                    src={`https://c.animaapp.com/rTjTKVhk/img/${item.icon}-1.svg`}
                    className="w-6 h-6"
                    alt={item.label}
                  />
                  {item.label}
                </span>
                <ChevronRightCircleIcon className="ml-auto h-4 w-4" />
              </Button>
            ))}
          </nav>

          <Card className="mt-auto bg-gradient-to-b from-[#eaabf0] to-[#4622e9]">
            <CardContent className="p-6 text-center text-white">
              <p className="font-semibold mb-4">
                Upgrade to PRO to get access all Features!
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-[#4925e9]"
              >
                Get Pro Now!
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://c.animaapp.com/rTjTKVhk/img/ellipse-8@2x.png" />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Sriram</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
            <ChevronDownCircleIcon className="ml-auto h-6 w-6" />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium">Hello Sriram 👋,</h2>
          <Input
            placeholder="Search"
            className="w-[216px]"
            startIcon={<SearchCheckIcon className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>All Employees</CardTitle>
            <p className="text-sm text-[#16c098]">Active Members</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6">
              <Input
                placeholder="Search"
                className="w-[216px]"
                startIcon={<SearchCheckIcon className="h-4 w-4" />}
              />
              <div className="flex gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[154px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <ChevronDownCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.email}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.branch}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          employee.status === "Active"
                            ? "success"
                            : "destructive"
                        }
                        className={
                          employee.status === "Active"
                            ? "bg-[#15c09861] text-[#008667] border-[#00b086]"
                            : "bg-[#ffc4c4] text-[#df0303] border-[#df0404]"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-[#b5b7c0]">
                Showing data 1 to 8 of 256K entries
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeftCircleIcon className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <span className="flex items-center px-2">...</span>
                <Button variant="outline" size="sm">
                  40
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRightCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
