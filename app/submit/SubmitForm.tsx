"use client";

import { LoadingSpinner } from "@/app/components/ui/loading-spinner";
import ProjectImageUploader from "@/app/components/ProjectImageUploader";

interface SubmitFormProps {
  projectName: string;
  setProjectName: (val: string) => void;
  githubUrl: string;
  setGithubUrl: (val: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  existingImages: string[];
  onRemoveExistingImage: (index: number) => void;
  newImages: string[];
  onAddNewImages: (urls: string[]) => void;
  onRemoveNewImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  isExisting: boolean;
  isLightMode: boolean;
  labelClass: string;
  inputClass: string;
  submissionsEnabled: boolean;
  isAdmin: boolean;
}

export default function SubmitForm({
  projectName,
  setProjectName,
  githubUrl,
  setGithubUrl,
  websiteUrl,
  setWebsiteUrl,
  description,
  setDescription,
  existingImages,
  onRemoveExistingImage,
  newImages,
  onAddNewImages,
  onRemoveNewImage,
  onSubmit,
  isSaving,
  isExisting,
  isLightMode,
  labelClass,
  inputClass,
  submissionsEnabled,
  isAdmin
}: SubmitFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`border-[3px] p-8 ${isLightMode
        ? "border-black bg-white shadow-[8px_8px_0_#000]"
        : "border-white/30 bg-[#111] shadow-[8px_8px_0_#fff]"
        }`}
    >
      <div className="flex flex-col gap-6">
        {/* Project Name */}
        <div>
          <label htmlFor="project-name" className={labelClass}>
            Project Name *
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. SmartBharat Analytics"
            className={inputClass}
            required
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="github-url" className={labelClass}>
            GitHub URL *
          </label>
          <input
            id="github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="github.com/yourteam/project"
            className={inputClass}
            required
          />
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="website-url" className={labelClass}>
            Website URL (optional)
          </label>
          <input
            id="website-url"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="yourproject.com"
            className={inputClass}
          ></input>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Project Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project, its impact, the technology used, and how it addresses the problem statement..."
            rows={6}
            className={`${inputClass} resize-y`}
            required
          />
        </div>

        {/* Images */}
        <div>
          <ProjectImageUploader
            existingImages={existingImages}
            newImages={newImages}
            onAddImages={onAddNewImages}
            onRemoveExistingImage={onRemoveExistingImage}
            onRemoveNewImage={onRemoveNewImage}
            isLightMode={isLightMode}
            maxImages={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving || (!submissionsEnabled && !isAdmin)}
          className={`relative flex items-center justify-center gap-3 border-[3px] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${isLightMode
            ? "border-black bg-[#ff00a0] text-white shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]"
            : "border-white bg-[#ff00a0] text-white shadow-[6px_6px_0_#fff] hover:shadow-[8px_8px_0_#c0ff00]"
            }`}
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="sm"></LoadingSpinner>
              Saving...
            </>
          ) : !submissionsEnabled && !isAdmin ? (
            "Submissions Closed"
          ) : isExisting ? (
            "Update Project"
          ) : (
            "Submit Project"
          )}
        </button>
      </div>
    </form>
  );
}
