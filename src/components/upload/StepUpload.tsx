"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";

interface StepUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File, previewUrl: string) => void;
  onFileRemove: () => void;
  onUseSample: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StepUpload({
  file,
  previewUrl,
  onFileSelect,
  onFileRemove,
  onUseSample,
}: StepUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (f: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError("Please upload a JPG, PNG, or PDF file.");
        return;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setError(`File must be under ${MAX_SIZE_MB}MB.`);
        return;
      }
      const url = URL.createObjectURL(f);
      onFileSelect(f, url);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const isPdf = file?.type === "application/pdf";

  return (
    <div>
      {/* Heading */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--tp-text-primary)",
          margin: 0,
          marginBottom: 8,
        }}
      >
        Upload your prescription
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: 16,
          color: "var(--tp-text-secondary)",
          margin: 0,
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        Take a photo of your prescription or upload a file. Make sure all details
        are clearly visible.
      </p>

      {/* Drop zone or file preview */}
      {!file ? (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? "var(--tp-primary)" : "var(--tp-border)"}`,
              borderRadius: 12,
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 0.15s, background-color 0.15s",
              backgroundColor: isDragOver
                ? "rgba(222, 120, 31, 0.05)"
                : "transparent",
            }}
          >
            <Upload
              size={32}
              style={{
                color: "var(--tp-text-tertiary)",
                marginBottom: 12,
              }}
            />
            <span
              style={{
                fontSize: 16,
                color: "var(--tp-text-secondary)",
                marginBottom: 4,
              }}
            >
              Drag and drop your file here
            </span>
            <span
              style={{
                fontSize: 14,
                color: "var(--tp-text-tertiary)",
                marginBottom: 4,
              }}
            >
              or
            </span>
            <span
              style={{
                fontSize: 16,
                color: "var(--tp-primary)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              browse files
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--tp-text-tertiary)",
                marginTop: 12,
              }}
            >
              JPG, PNG, or PDF up to 10MB
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </>
      ) : (
        <div
          style={{
            border: "1px solid var(--tp-border)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Thumbnail */}
          {isPdf ? (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                backgroundColor: "#F5F5F4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={24} style={{ color: "var(--tp-text-tertiary)" }} />
            </div>
          ) : (
            <img
              src={previewUrl ?? undefined}
              alt="Preview"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                objectFit: "cover",
                flexShrink: 0,
                backgroundColor: "#F5F5F4",
              }}
            />
          )}

          {/* File info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--tp-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--tp-text-tertiary)",
                marginTop: 2,
              }}
            >
              {formatFileSize(file.size)}
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={onFileRemove}
            aria-label="Remove file"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--tp-text-tertiary)",
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>{error}</p>
      )}

      {/* Use sample link */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={onUseSample}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            color: "var(--tp-primary)",
            fontWeight: 500,
            padding: 0,
          }}
        >
          Use sample prescription
        </button>
      </div>
    </div>
  );
}
