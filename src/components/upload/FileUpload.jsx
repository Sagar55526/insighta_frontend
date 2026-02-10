import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2, FileText, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import api from '../../services/api';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // 0 to 100
    const [processingStage, setProcessingStage] = useState(null); // 'uploading' | 'processing' | null
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);
            setUploadStatus(null);
            setMessage('');
            setUploadProgress(0);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            setUploadStatus(null);
            setMessage('');
            setUploadProgress(0);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length === 1) {
            setUploadStatus(null);
            setMessage('');
            setUploadProgress(0);
            setProcessingStage(null);
        }
    };

    const clearFiles = () => {
        setFiles([]);
        setUploadStatus(null);
        setMessage('');
        setUploadProgress(0);
        setProcessingStage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadStatus(null);
        setProcessingStage('uploading');
        setUploadProgress(0);
        setMessage('');

        const formData = new FormData();
        files.forEach(file => {
            formData.append('input_files', file);
        });

        try {
            await api.post('/api/v1/ingest/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                    if (percentCompleted === 100) {
                        setProcessingStage('processing');
                    }
                },
            });

            setUploadStatus('success');
            setMessage(`${files.length} file(s) uploaded and processed successfully!`);
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Upload error", error);
            setUploadStatus('error');
            setMessage(error.response?.data?.detail || 'Failed to upload files. Please try again.');
        } finally {
            setIsUploading(false);
            setProcessingStage(null);
            setUploadProgress(0);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Data Intelligence</h2>
                <p className="text-slate-500 mt-2 font-medium text-lg">Upload your datasets to begin the insight extraction process</p>
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/40 shadow-2xl relative overflow-hidden group">
                <div
                    className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-500 cursor-pointer relative z-10
            ${isDragging ? 'border-primary-500 bg-primary-50/50 scale-[0.99] shadow-inner' : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50/50'}
            ${uploadStatus === 'error' ? 'border-red-300 bg-red-50/50' : ''}
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        disabled={isUploading}
                    />

                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-slate-100/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-12 h-12 text-slate-400 group-hover:text-primary-500 transition-colors duration-500" />
                        </div>
                        <p className="text-xl font-bold text-slate-900 mb-1">Drag intelligence sources here</p>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">Select multiple PDF, CSV, or TXT datasets.</p>
                    </div>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                    <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Selected Entities ({files.length})</h3>
                            {!isUploading && (
                                <button
                                    onClick={clearFiles}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {files.map((f, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white/60 border border-white/40 rounded-2xl shadow-sm group/file hover:bg-white/80 transition-all">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-slate-900 truncate">{f.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    {!isUploading && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Decorative background elements inside the card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full blur-2xl -z-0 translate-x-10 -translate-y-10 group-hover:bg-primary-200/40 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/30 rounded-full blur-2xl -z-0 -translate-x-10 translate-y-10 group-hover:bg-indigo-200/40 transition-colors"></div>

                {/* Progress Bar / Processing State */}
                {isUploading && (
                    <div className="mt-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">
                                    {processingStage === 'uploading' ? 'Data Transmission' : 'Intelligence Processing'}
                                </h4>
                                <p className="text-slate-500 text-sm font-medium">
                                    {processingStage === 'uploading'
                                        ? `Streaming ${files.length} file(s)... ${uploadProgress}%`
                                        : 'Decrypting patterns and generating semantic schema...'}
                                </p>
                            </div>
                            {processingStage === 'processing' && <Loader2 className="w-6 h-6 animate-spin text-primary-600 mb-1" />}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/50">
                            <div
                                className={`h-full rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${processingStage === 'processing' ? 'bg-gradient-to-r from-primary-500 via-indigo-600 to-primary-500 animate-shimmer bg-[length:200%_100%] w-full' : 'bg-primary-600'}`}
                                style={{ width: processingStage === 'uploading' ? `${uploadProgress}%` : '100%' }}
                            ></div>
                        </div>
                    </div>
                )}

                {uploadStatus === 'success' && (
                    <div className="mt-10 p-6 bg-green-50/50 border border-green-100 rounded-3xl flex items-center text-green-700 animate-in zoom-in-95 duration-500 shadow-sm">
                        <div className="p-2 bg-green-100 rounded-xl mr-4 shadow-sm">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-lg">{message}</span>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="mt-10 p-6 bg-red-50/50 border border-red-100 rounded-3xl flex items-center text-red-700 animate-in zoom-in-95 duration-500 shadow-sm">
                        <div className="p-2 bg-red-100 rounded-xl mr-4 shadow-sm">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-lg">{message}</span>
                    </div>
                )}

                {!isUploading && files.length > 0 && !uploadStatus && (
                    <div className="mt-10 flex justify-center">
                        <Button
                            onClick={handleUpload}
                            className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-600/20 px-12 py-4 font-bold text-lg transition-all active:scale-[0.98]"
                        >
                            Propagate Knowledge Base
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
