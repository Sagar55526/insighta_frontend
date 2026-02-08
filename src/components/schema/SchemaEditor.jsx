import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2, ArrowLeft, File } from 'lucide-react';
import { getViewSchema, updateSchema } from '../../services/ingest';
import Button from '../common/Button';
import Input from '../common/Input';
import Layout from '../layout/Layout';

const SchemaEditor = () => {
    const [schemaInfo, setSchemaInfo] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchSchema();
    }, []);

    const fetchSchema = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getViewSchema();
            setSchemaInfo({
                db_id: data.db_id,
                table_name: data.table_name,
                file_name: data.file_name,
                schema_status: data.schema_status
            });
            // Ensure we have a deep copy to edit
            setColumns(data.schema || []);
        } catch (err) {
            console.error("Failed to fetch schema", err);
            // If 404 or other error, handle gracefully
            setError('Failed to load schema. Make sure you have uploaded a file first.');
        } finally {
            setLoading(false);
        }
    };

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setColumns(newColumns);
        setSuccess(null); // Clear success message on edit
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await updateSchema({ schema: columns });
            setSuccess('Schema updated successfully!');
            // Optionally refresh
            // await fetchSchema(); 
        } catch (err) {
            console.error("Failed to update schema", err);
            setError('Failed to update schema. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </Layout>
        );
    }

    return (
        // <Layout>
        <div className="max-w-5xl mx-auto pb-16">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schema Management</h1>
                    {schemaInfo && (
                        <div className="flex items-center gap-2 mt-2 text-slate-500 font-medium bg-slate-100/50 py-1 px-3 rounded-lg w-fit">
                            <File className="w-4 h-4 text-primary-600" />
                            <span>File: {schemaInfo.file_name}</span>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleSave}
                    isLoading={saving}
                    disabled={!schemaInfo}
                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-600/20 px-8 py-3.5 font-bold transition-all active:scale-[0.98]"
                >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                </Button>
            </div>

            {error && (
                <div className="bg-red-50/50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50/50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl mb-8 flex items-center animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            {!schemaInfo ? (
                <div className="glass p-20 rounded-[2.5rem] border border-white/40 shadow-xl text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-6">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <p className="text-slate-900 text-xl font-bold mb-2">No schema information available</p>
                    <p className="text-slate-500 font-medium">Please upload a file to generate an intelligent schema.</p>
                </div>
            ) : (
                <div className="glass rounded-[2rem] border border-white/40 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/4">
                                        Column Name
                                    </th>
                                    <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-3/4">
                                        Intelligence Mapping
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent divide-y divide-slate-100">
                                {columns.map((col, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="text-sm font-bold text-slate-900 font-display">{col.column_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative group/input">
                                                <input
                                                    type="text"
                                                    value={col.description || ''}
                                                    onChange={(e) => handleColumnChange(idx, 'description', e.target.value)}
                                                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none placeholder:text-slate-400 shadow-sm"
                                                    placeholder="Assign descriptive intelligence to this column..."
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        // </Layout>
    );
};

export default SchemaEditor;
