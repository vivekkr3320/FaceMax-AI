"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface UploadClientProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function UploadClient({ user }: UploadClientProps) {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Camera settings
  const [useCamera, setUseCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // checkout states
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [reportStep, setReportStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isImageVerified, setIsImageVerified] = useState(false);

  // Mock checkout dialog state
  const [mockCheckout, setMockCheckout] = useState<{
    isOpen: boolean;
    assessmentType: string;
    orderId: string;
    amount: number;
  } | null>(null);

  const startCamera = async () => {
    resetPhotoState();
    setUseCamera(true);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Could not access camera. Please check permissions or upload a photo file.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          stopCamera();
          verifyAndSetFile(file);
        }
      }, "image/jpeg");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file.");
        return;
      }
      verifyAndSetFile(file);
    }
  };

  const resetPhotoState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsImageVerified(false);
    setErrorMessage(null);
  };

  const verifyAndSetFile = async (file: File) => {
    setIsValidating(true);
    setErrorMessage(null);
    setIsImageVerified(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const validateRes = await fetch("/api/upload/validate", {
        method: "POST",
        body: formData,
      });

      if (!validateRes.ok) {
        const errData = await validateRes.json();
        throw new Error(errData.error || "Failed to validate photo parameters.");
      }

      const data = await validateRes.json();
      
      if (!data.valid) {
        setErrorMessage(data.reason || "Image check failed. Please upload a clear face profile.");
      } else {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setIsImageVerified(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to validate image. Try a different photo.");
    } finally {
      setIsValidating(false);
    }
  };

  const triggerCheckout = async (assessmentType: string) => {
    if (!selectedFile || !isImageVerified) return;

    setLoadingType(assessmentType);
    setErrorMessage(null);

    try {
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentType }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create checkout order.");
      }

      const orderData = await orderRes.json();
      const { orderId, amount, isMock, keyId } = orderData;

      if (isMock) {
        setMockCheckout({
          isOpen: true,
          assessmentType,
          orderId,
          amount,
        });
        setLoadingType(null);
        return;
      }

      // Live Razorpay popup checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "FaceMax AI",
        description: `${assessmentType} Facial Assessment`,
        order_id: orderId,
        handler: async function (response: any) {
          await runServerAnalysis({
            orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to trigger checkout.");
    } finally {
      if (!mockCheckout) {
        setLoadingType(null);
      }
    }
  };

  const handleSimulateSuccess = async () => {
    if (!mockCheckout) return;
    const { assessmentType, orderId } = mockCheckout;
    setMockCheckout(null);
    
    setLoadingType(assessmentType);
    await runServerAnalysis({
      orderId,
      paymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
      signature: "mock_signature_approved",
    });
  };

  const runServerAnalysis = async ({ orderId, paymentId, signature }: any) => {
    if (!selectedFile) return;

    setIsProcessingReport(true);
    setLoadingType(null);
    setErrorMessage(null);

    const steps = [
      "Securing transient image buffer in-memory...",
      "Analyzing overall face health score...",
      "Matching face shape outlines...",
      "Mapping dermal skin parameters...",
      "Executing facial symmetry alignment check...",
      "Consulting structural recommendations database...",
      "Formatting daily routines and disclaimers...",
      "Compiling professional assessment report..."
    ];

    let currentStep = 0;
    setReportStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setReportStep(steps[currentStep]);
      }
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("paymentId", paymentId);
      formData.append("signature", signature);
      formData.append("file", selectedFile);

      const res = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        body: formData,
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to complete payment verification & analysis.");
      }

      const data = await res.json();
      setReportStep("Report compiled successfully! Redirecting...");
      
      router.push(`/analysis/${data.id}`);
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "An error occurred compiling your report.");
      setIsProcessingReport(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 fade-in">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Personalized Facial Assessment
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
          Capture or upload your selfie. Preview the image, select your report format, and generate your professional analysis.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm mb-6 text-center max-w-xl mx-auto">
          {errorMessage}
        </div>
      )}

      {/* Main Upload and Preview Container */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden shadow-2xl max-w-2xl mx-auto mb-10">
        
        {/* Validation check loader */}
        {isValidating && (
          <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center z-40">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <strong className="text-white text-sm">Validating selfie parameters...</strong>
            <p className="text-zinc-400 text-2xs mt-1">Verifying lighting, face position, and focus...</p>
          </div>
        )}

        {/* High-tech scanning screen loader */}
        {isProcessingReport && (
          <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center z-40">
            <div className="scan-line" />
            <div className="w-40 h-40 border border-dashed border-indigo-500 rounded-full flex items-center justify-center text-4xl mb-8 animate-pulse shadow-lg shadow-indigo-500/10">
              🔍
            </div>
            <strong className="text-lg text-white mb-2">Compiling Assessment...</strong>
            <p className="text-indigo-400 text-xs font-mono text-center px-6">
              {reportStep}
            </p>
          </div>
        )}

        {/* Camera stream view */}
        {useCamera && cameraActive ? (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-6 border border-white/5">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              <button onClick={capturePhoto} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                Capture Photo
              </button>
              <button onClick={stopCamera} className="px-5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                Close Camera
              </button>
            </div>
          </div>
        ) : (
          <>
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/5 mb-6">
                <img 
                  src={previewUrl} 
                  alt="Selfie Preview" 
                  className="w-full h-full object-contain" 
                />
                <button 
                  onClick={resetPhotoState} 
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer border border-white/10"
                >
                  ✕
                </button>
              </div>
            ) : (
              /* Drag Zone */
              <div 
                className="border-2 border-dashed border-white/5 rounded-xl p-12 text-center bg-white/1 hover:bg-white/2 cursor-pointer transition-all mb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    verifyAndSetFile(file);
                  }
                }}
              >
                <span className="text-5xl block mb-4">📁</span>
                <h3 className="text-base font-bold text-white mb-2">Drag & Drop Selfie</h3>
                <p className="text-zinc-400 text-xs mb-6">Supports JPG, PNG up to 5MB.</p>
                
                <div className="flex gap-3 justify-center">
                  <label className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors border border-white/5 cursor-pointer">
                    Choose File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  <button onClick={startCamera} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                    📷 Use Web Camera
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs text-zinc-400 leading-relaxed">
          <strong>🔒 Privacy Commitment:</strong> We process your photos in-memory using secure SSL buffers. No image files are saved permanently on disk or stored in tables.
        </div>
      </div>

      {/* Package Selection Display (Only visible when file is verified successfully) */}
      {selectedFile && isImageVerified && !isProcessingReport && (
        <div className="fade-in max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-white text-center mb-6">Select Assessment Package</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quick Facial Assessment (₹49) */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-3">
                  ₹49 package
                </span>
                <h3 className="text-lg font-black text-white mb-2">Quick Facial Assessment</h3>
                <p className="text-zinc-450 text-xs mb-4">A swift structural health snapshot.</p>
                
                <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                  <li>✓ Overall Face Health Score</li>
                  <li>✓ Face Shape mapping</li>
                  <li>✓ Skin parameters (Acne, red, spots)</li>
                  <li>✓ Feature symmetry & balance scores</li>
                  <li>✓ Primary strengths & improvements</li>
                  <li>✓ Daily care routine</li>
                  <li className="line-through opacity-30">✗ 30-Day step plan timeline</li>
                  <li className="line-through opacity-30">✗ PDF report download</li>
                </ul>
              </div>
              <button
                onClick={() => triggerCheckout("QUICK")}
                disabled={loadingType !== null}
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                {loadingType === "QUICK" ? "Initiating..." : "Buy Quick (₹49)"}
              </button>
            </div>

            {/* Complete Facial Assessment (₹99) */}
            <div className="glass-card rounded-2xl p-6 border border-purple-500/30 flex flex-col justify-between relative shadow-lg shadow-purple-500/5">
              <span className="absolute top-[-10px] right-4 px-2 py-0.5 bg-purple-650 text-white text-4xs font-black rounded-full uppercase tracking-widest">
                Most Popular
              </span>
              <div>
                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-2xs font-bold rounded-full uppercase tracking-wider mb-3">
                  ₹99 package
                </span>
                <h3 className="text-lg font-black text-white mb-2">Complete Facial Assessment</h3>
                <p className="text-zinc-450 text-xs mb-4">Our most detailed aesthetic blueprint.</p>
                
                <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                  <li>✓ Overall Face Health Score</li>
                  <li>✓ Face Shape mapping</li>
                  <li>✓ Skin parameters (Acne, red, spots)</li>
                  <li>✓ Feature symmetry & balance scores</li>
                  <li>✓ Primary strengths & improvements</li>
                  <li>✓ Daily care routine</li>
                  <li>✓ <strong>30-Day step plan timeline</strong></li>
                  <li>✓ <strong>High-quality PDF download option</strong></li>
                  <li>✓ <strong>Progress baseline curve tracking</strong></li>
                </ul>
              </div>
              <button
                onClick={() => triggerCheckout("COMPLETE")}
                disabled={loadingType !== null}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-purple-600/10"
              >
                {loadingType === "COMPLETE" ? "Initiating..." : "Buy Complete (₹99)"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Simulated Razorpay Checkout Dialog Modal */}
      {mockCheckout && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="glass-card rounded-2xl max-w-md w-full border border-indigo-500 p-8 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white mb-2">💳 Razorpay Simulator Mode</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Running simulation checkout because no live credentials were found in `.env`.
            </p>

            <div className="bg-white/3 border border-white/5 p-4 rounded-xl mb-6 text-sm flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Selected Type:</span>
                <strong className="text-white">{mockCheckout.assessmentType} Assessment</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Order ID:</span>
                <span className="font-mono text-zinc-300 text-xs">{mockCheckout.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Price (INR):</span>
                <strong className="text-indigo-400 text-lg">₹{mockCheckout.amount / 100}</strong>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSimulateSuccess}
                disabled={loadingType !== null}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {loadingType ? "Processing..." : "Simulate Success"}
              </button>
              <button
                onClick={() => setMockCheckout(null)}
                className="px-5 py-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl border border-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
