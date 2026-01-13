"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { createGig } from "@/store/slices/gigs.slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
}

export default function CreateGigPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation functions
  const validateTitle = (value: string): string | undefined => {
    if (!value.trim()) return "Title is required";
    if (value.trim().length < 5) return "Title must be at least 5 characters";
    if (value.trim().length > 100) return "Title cannot exceed 100 characters";
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) return "Description is required";
    if (value.trim().length < 20)
      return "Description must be at least 20 characters";
    if (value.trim().length > 2000)
      return "Description cannot exceed 2000 characters";
    return undefined;
  };

  const validateBudget = (value: string): string | undefined => {
    if (!value) return "Budget is required";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Budget must be a valid number";
    if (numValue <= 0) return "Budget must be greater than 0";
    if (numValue > 10000000) return "Budget seems too high";
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field: string) => {
    let error: string | undefined;

    switch (field) {
      case "title":
        error = validateTitle(title);
        break;
      case "description":
        error = validateDescription(description);
        break;
      case "budget":
        error = validateBudget(budget);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.title = validateTitle(title);
    newErrors.description = validateDescription(description);
    newErrors.budget = validateBudget(budget);

    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      budget: true,
    });

    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        createGig({
          title: title.trim(),
          description: description.trim(),
          budget: parseFloat(budget),
        })
      ).unwrap();

      toast.success("Gig created successfully!");
      router.push(`/gigs/${result._id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create gig";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Post a New Gig
          </h1>
          <p className="text-muted-foreground">
            Create a project and receive bids from talented freelancers
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide clear details to attract the right freelancers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Build a React-based Dashboard"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (touched.title) validateField("title");
                  }}
                  onBlur={() => handleBlur("title")}
                  className={
                    touched.title && errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {touched.title && errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  Project Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements, goals, and any specific technical requirements..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (touched.description) validateField("description");
                  }}
                  onBlur={() => handleBlur("description")}
                  rows={8}
                  className={
                    touched.description && errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {touched.description && errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length}/2000 characters (min 20)
                </p>
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget">
                  Budget (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 50000"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (touched.budget) validateField("budget");
                  }}
                  onBlur={() => handleBlur("budget")}
                  min="1"
                  step="1"
                  className={
                    touched.budget && errors.budget
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {touched.budget && errors.budget && (
                  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your project budget in Indian Rupees
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-semibold mb-2 text-sm">
                  Tips for a successful gig:
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Be specific about your requirements</li>
                  <li>• Set a realistic budget</li>
                  <li>• Mention any technical skills needed</li>
                  <li>• Include timeline expectations</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Gig"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
