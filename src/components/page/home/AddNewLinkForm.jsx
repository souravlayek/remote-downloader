import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

import { ReloadIcon } from "@radix-ui/react-icons";
const AddLinkForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: {
      value: "",
      error: "",
    },
    link: {
      value: "",
      error: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: {
        value,
        error: "",
      },
    }));
  };

  const handleSubmit = async () => {
    if (handleValidate()) {
      // Reset form state
      try {
        setIsLoading(true);
        const fetchResponse = await fetch("/api/download/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.name.value,
            url: formState.link.value,
          }),
        });
        const response = await fetchResponse.json();
        if (response.error) {
          throw new Error(response.error);
        }
        toast({
          title: "Added Link Successfully",
          description: response.message,
        });
        onSuccess?.();
        setFormState({
          name: {
            value: "",
            error: "",
          },
          link: {
            value: "",
            error: "",
          },
        });
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleValidate = () => {
    let isValid = true;
    if (!formState.name.value) {
      isValid = false;
      setFormState((prevFormState) => ({
        ...prevFormState,
        name: {
          ...prevFormState.name,
          error: "Please enter a name",
        },
      }));
    }
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    if (!formState.link.value || !urlRegex.test(formState.link.value)) {
      isValid = false;
      setFormState((prevFormState) => ({
        ...prevFormState,
        link: {
          ...prevFormState.link,
          error: "Please enter a link",
        },
      }));
    }

    return isValid;
  };
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">File Name</Label>
        <Input
          id="name"
          name="name"
          onChange={handleInputChange}
          placeholder="eg. my_file"
          value={formState.name.value}
          className={formState.name.error ? "border-red-500" : ""}
        />
        {formState.name.error && (
          <p className="text-red-500 text-sm">{formState.name.error}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="link">URL</Label>
        <Textarea
          id="link"
          placeholder="eg. https://example.com/file.pdf"
          name="link"
          onChange={handleInputChange}
          rows={6}
          value={formState.link.value}
          className={formState.link.error ? "border-red-500" : ""}
        />
        {formState.link.error && (
          <p className="text-red-500 text-sm">{formState.link.error}</p>
        )}
      </div>
      <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Validating Link{" "}
          </>
        ) : (
          "Start Download"
        )}
      </Button>
    </div>
  );
};

export default AddLinkForm;
