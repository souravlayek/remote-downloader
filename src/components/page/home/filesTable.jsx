import DataTable from "@/components/custom/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Modal from "@/components/custom/Modal";
import AddLinkForm from "./AddNewLinkForm";
import { debounce } from "@/utils/clientHelper";
const StatusFilter = ({ value, onChange }) => {
  return (
    <Select
      onValueChange={(value) => {
        onChange(value);
      }}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter By Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="downloading">Downloading</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "url",
    label: "Url",
    render: (url) => {
      return (
        <a
          href={url}
          className="underline text-blue-600 hover:text-blue-400 duration-300 flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Link
          <ArrowUpRight className="w-4 h-4" />
        </a>
      );
    },
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "status",
    label: "Status",
    render: (status) => {
      if (status === "completed") {
        return <span className="text-green-500">Completed</span>;
      } else if (status === "downloading") {
        return <span className="text-yellow-500">Downloading</span>;
      } else if (status === "failed") {
        return <span className="text-red-500">Failed</span>;
      } else {
        return <span className="text-gray-500">Pending</span>;
      }
    },
  },
];

const FilesTable = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const getFiles = async (searchText, selectedStatus) => {
    try {
      setisLoading(true);
      let queryString = "";
      if (selectedStatus === "all") {
        queryString = "";
      } else {
        queryString = `?status=${selectedStatus}`;
      }
      if (searchText) {
        if (queryString) queryString = `?name=${searchText}`;
        else queryString += `&name=${searchText}`;
      }
      const response = await fetch("/api/download/list" + queryString);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setisLoading(false);
    }
  };
  const debouncedGetFiles = useCallback(debounce(getFiles, 500), []);
  useEffect(() => {
    debouncedGetFiles(searchText, selectedStatus);
  }, [searchText, selectedStatus]);
  return (
    <div>
      <div className="flex justify-between">
        <h1>Your Downloads</h1>
        <div className="flex gap-4">
          <Input
            className="w-[180px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
          />
          <StatusFilter value={selectedStatus} onChange={setSelectedStatus} />
          <Button onClick={() => setAddLinkModalOpen(true)}>Add Link</Button>
        </div>
      </div>
      <DataTable
        title={
          <Button
            onClick={() => debouncedGetFiles(searchText, selectedStatus)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Getting
                files
              </>
            ) : (
              "Tap to Refresh"
            )}
          </Button>
        }
        loading={isLoading}
        data={data}
        column={columns}
      />
      <Modal
        open={addLinkModalOpen}
        setOpen={setAddLinkModalOpen}
        title="Add New Link"
        description="Paste link of file or Youtube eg. https://example.com/file.pdf or https://www.youtube.com/watch?v=1234"
      >
        <AddLinkForm
          onSuccess={() => {
            getFiles(searchText, selectedStatus);
            setAddLinkModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default FilesTable;
