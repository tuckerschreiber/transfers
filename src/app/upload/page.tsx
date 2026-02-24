"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ProgressBar from "@/components/upload/ProgressBar";
import StepUpload from "@/components/upload/StepUpload";
import StepConfirmDetails, {
  type PrescriptionDetails,
} from "@/components/upload/StepConfirmDetails";
import StepInsurance, {
  type InsuranceDetails,
} from "@/components/upload/StepInsurance";
import StepDelivery, {
  type DeliveryDetails,
} from "@/components/upload/StepDelivery";
import StepConsent from "@/components/upload/StepConsent";
import StepReview from "@/components/upload/StepReview";
import StepConfirmation from "@/components/upload/StepConfirmation";
import UploadDemoSidebar from "@/components/upload/UploadDemoSidebar";
import type { UploadStatus } from "@/lib/types";

const SAMPLE_DATA: PrescriptionDetails = {
  medicationName: "Sertraline",
  dose: "50mg once daily",
  quantity: "30",
  prescriberName: "Dr. Emily Watson",
  dateWritten: "2026-02-20",
};

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prescriptionDetails, setPrescriptionDetails] =
    useState<PrescriptionDetails>({
      medicationName: "",
      dose: "",
      quantity: "",
      prescriberName: "",
      dateWritten: "",
    });

  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetails>({
    province: "Ontario",
    insuranceProvider: "Sun Life",
    insurancePolicyNumber: "SL-2847561",
    insuranceGroupNumber: "GRP-104",
  });

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    street: "45 King St W",
    unit: "Suite 1200",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5H 1J8",
  });

  const [priceConsent, setPriceConsent] = useState(false);
  const [counselingConsent, setCounselingConsent] = useState(false);

  const [submittedUploadId, setSubmittedUploadId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("under_review");

  const canContinue = currentStep !== 4 || (priceConsent && counselingConsent);

  const handleFileSelect = useCallback((f: File, url: string) => {
    setFile(f);
    setPreviewUrl(url);
  }, []);

  const handleFileRemove = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  const handleUseSample = useCallback(() => {
    const mockFile = new File(["sample"], "sample-prescription.svg", {
      type: "image/svg+xml",
    });
    setFile(mockFile);
    setPreviewUrl("/sample-prescription.svg");
    setPrescriptionDetails(SAMPLE_DATA);
    setCurrentStep(1);
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: "Demo User",
        patientEmail: "demo@felixforyou.ca",
        imageUrl: "/sample-prescription.svg",
        medicationName: prescriptionDetails.medicationName,
        dose: prescriptionDetails.dose,
        quantity: parseInt(prescriptionDetails.quantity),
        prescriberName: prescriptionDetails.prescriberName,
        dateWritten: prescriptionDetails.dateWritten,
        province: insuranceDetails.province,
        insuranceProvider: insuranceDetails.insuranceProvider,
        insurancePolicyNumber: insuranceDetails.insurancePolicyNumber,
        insuranceGroupNumber: insuranceDetails.insuranceGroupNumber || null,
        deliveryAddress: {
          street: deliveryDetails.street,
          unit: deliveryDetails.unit || null,
          city: deliveryDetails.city,
          province: deliveryDetails.province,
          postalCode: deliveryDetails.postalCode,
        },
      }),
    });
    const upload = await response.json();
    setSubmittedUploadId(upload.id);
    setUploadStatus("under_review");
    setCurrentStep(6);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepUpload
            file={file}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            onUseSample={handleUseSample}
          />
        );
      case 1:
        return (
          <StepConfirmDetails
            previewUrl={previewUrl}
            details={prescriptionDetails}
            onChange={setPrescriptionDetails}
          />
        );
      case 2:
        return (
          <StepInsurance
            details={insuranceDetails}
            onChange={setInsuranceDetails}
          />
        );
      case 3:
        return (
          <StepDelivery
            details={deliveryDetails}
            onChange={setDeliveryDetails}
          />
        );
      case 4:
        return (
          <StepConsent
            priceConsent={priceConsent}
            counselingConsent={counselingConsent}
            onPriceConsentChange={setPriceConsent}
            onCounselingConsentChange={setCounselingConsent}
          />
        );
      case 5:
        return (
          <StepReview
            previewUrl={previewUrl}
            prescriptionDetails={prescriptionDetails}
            insuranceDetails={insuranceDetails}
            deliveryDetails={deliveryDetails}
            onEditStep={(step) => setCurrentStep(step)}
          />
        );
      default:
        return (
          <div className="text-center" style={{ color: "var(--felix-text-tertiary)" }}>
            Step {currentStep + 1} of 7
          </div>
        );
    }
  };

  // Confirmation screen with demo sidebar — completely different layout
  if (currentStep === 6) {
    return (
      <div className="felix-page flex h-screen">
        <UploadDemoSidebar
          uploadStatus={uploadStatus}
          onStatusChange={async (status) => {
            setUploadStatus(status);
            if (submittedUploadId) {
              await fetch(`/api/uploads/${submittedUploadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
              });
            }
          }}
          onReset={() => {
            setCurrentStep(0);
            setFile(null);
            setPreviewUrl(null);
            setPrescriptionDetails({ medicationName: "", dose: "", quantity: "", prescriberName: "", dateWritten: "" });
            setInsuranceDetails({ province: "Ontario", insuranceProvider: "Sun Life", insurancePolicyNumber: "SL-2847561", insuranceGroupNumber: "GRP-104" });
            setDeliveryDetails({ street: "45 King St W", unit: "Suite 1200", city: "Toronto", province: "Ontario", postalCode: "M5H 1J8" });
            setPriceConsent(false);
            setCounselingConsent(false);
            setSubmittedUploadId(null);
          }}
        />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-[560px]">
            <StepConfirmation />
          </div>
        </div>
      </div>
    );
  }

  const continueLabel = currentStep === 5 ? "Submit prescription for review" : "Continue";
  const handleContinue = () => {
    if (!canContinue) return;
    if (currentStep === 5) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <div className="felix-page min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/transfer-in" className="text-[20px] font-bold" style={{ color: "var(--felix-primary)" }}>
            felix
          </Link>
          <Link
            href="/pharmacy"
            className="text-[14px] transition-colors hover:underline"
            style={{ color: "var(--felix-text-secondary)" }}
          >
            Pharmacy Dashboard
          </Link>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="bg-white border-b" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <ProgressBar currentStep={currentStep} />
      </div>

      {/* Content area */}
      <div className="flex-1 flex justify-center pt-12 pb-24 px-6">
        <div className="w-full max-w-[560px]">
          {renderStep()}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <div className="max-w-[560px] mx-auto px-6 py-4 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="text-[16px] transition-colors hover:underline"
              style={{ color: "var(--felix-text-secondary)" }}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {currentStep < 6 && (
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="px-6 py-3 rounded-[12px] text-[16px] font-medium text-white transition-colors"
              style={{
                backgroundColor: "var(--felix-primary)",
                opacity: canContinue ? 1 : 0.5,
                cursor: canContinue ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (canContinue) e.currentTarget.style.backgroundColor = "var(--felix-primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--felix-primary)";
              }}
            >
              {continueLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
