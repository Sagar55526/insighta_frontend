import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2, File, Database, ChevronRight, Search } from 'lucide-react';
import { getViewSchema, updateSchema } from '../../services/ingest';
import Button from '../common/Button';
import Layout from '../layout/Layout';

const SchemaEditor = () => {
    const [schemas, setSchemas] = useState([]);
    const [selectedDbId, setSelectedDbId] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSchemas();
    }, []);

    const fetchSchemas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getViewSchema();
            setSchemas(data || []);

            if (data && data.length > 0) {
                const firstSchema = data[0];
                setSelectedDbId(firstSchema.db_id);
                setColumns(JSON.parse(JSON.stringify(firstSchema.schema || [])));
            }
        } catch (err) {
            console.error("Failed to fetch schemas", err);
            setError('Failed to load schemas. Make sure you have uploaded datasets first.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDataset = (dbId) => {
        const schema = schemas.find(s => s.db_id === dbId);
        if (schema) {
            setSelectedDbId(dbId);
            setColumns(JSON.parse(JSON.stringify(schema.schema || [])));
            setSuccess(null);
            setError(null);
        }
    };

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setColumns(newColumns);
        setSuccess(null);
    };

    const handleSave = async () => {
        if (!selectedDbId) return;

        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await updateSchema({ db_id: selectedDbId, schema: columns });
            setSuccess('Intelligence mapping updated successfully!');

            // Update local state for the schemas list
            setSchemas(prev => prev.map(s =>
                s.db_id === selectedDbId ? { ...s, schema: [...columns] } : s
            ));
        } catch (err) {
            console.error("Failed to update schema", err);
            setError('Failed to update schema. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const currentSchema = schemas.find(s => s.db_id === selectedDbId);
    const filteredDatasets = schemas.filter(s =>
        s.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
                    <p className="text-slate-500 font-medium animate-pulse">Synchronizing intelligence nodes...</p>
                </div>
            </Layout>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-16 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Intelligence Schema</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage and refine semantic patterns across your propagated datasets</p>
            </div>

            {schemas.length === 0 ? (
                <div className="glass p-20 rounded-[2.5rem] border border-white/40 shadow-xl text-center max-w-3xl mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-6">
                        <Database className="w-10 h-10" />
                    </div>
                    <p className="text-slate-900 text-xl font-bold mb-2">No active intelligence detected</p>
                    <p className="text-slate-500 font-medium mb-8">Please upload datasets to generate an editable intelligence schema.</p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Dataset Sidebar */}
                    <aside className="w-full lg:w-80 glass rounded-[2rem] border border-white/40 shadow-xl overflow-hidden flex flex-col shrink-0">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Available Source Entities</h3>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search datasets..."
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto p-3 space-y-1 custom-scrollbar">
                            {filteredDatasets.map((schema) => (
                                <button
                                    key={schema.db_id}
                                    onClick={() => handleSelectDataset(schema.db_id)}
                                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group
                                        ${selectedDbId === schema.db_id
                                            ? 'bg-primary-50 border border-primary-100 shadow-sm'
                                            : 'hover:bg-slate-50 border border-transparent'}
                                    `}
                                >
                                    <div className={`p-2 rounded-lg mr-3 transition-colors
                                        ${selectedDbId === schema.db_id ? 'bg-white text-primary-600 shadow-sm' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600'}
                                    `}>
                                        <File className="w-4 h-4" />
                                    </div>
                                    <div className="text-left overflow-hidden flex-1">
                                        <p className={`text-sm font-bold truncate ${selectedDbId === schema.db_id ? 'text-primary-900' : 'text-slate-700'}`}>
                                            {schema.file_name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {schema.schema?.length || 0} Dimensions
                                        </p>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedDbId === schema.db_id ? 'text-primary-400 translate-x-0' : 'text-transparent -translate-x-2'}`} />
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
                        {/* Status Messages */}
                        {error && (
                            <div className="bg-red-50/50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-medium text-sm">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50/50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-medium text-sm">{success}</span>
                            </div>
                        )}

                        {/* Schema Header & Save */}
                        <div className="glass p-6 rounded-[2rem] border border-white/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <h2 className="text-xl font-bold text-slate-900 truncate tracking-tight">{currentSchema?.file_name}</h2>
                                    <p className="text-xs text-slate-500 font-medium">Target Table: <span className="font-bold text-indigo-600">{currentSchema?.table_name}</span></p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSave}
                                isLoading={saving}
                                disabled={!selectedDbId}
                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/20 px-8 py-3.5 font-bold transition-all active:scale-[0.98] w-full md:w-auto"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save Intelligence Mapping
                            </Button>
                        </div>

                        {/* Schema Table */}
                        <div className="glass rounded-[2rem] border border-white/40 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/3">
                                                Intelligence Node
                                            </th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                Semantic Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-transparent divide-y divide-slate-100">
                                        {columns.map((col, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-primary-200 transition-colors">
                                                            <span className="text-[10px] font-black text-primary-600">{col.inferred_type?.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <span className="text-sm font-bold text-slate-900 block truncate leading-tight">{col.column_name}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{col.inferred_type}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <input
                                                        type="text"
                                                        value={col.description || ''}
                                                        onChange={(e) => handleColumnChange(idx, 'description', e.target.value)}
                                                        className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none placeholder:text-slate-400 shadow-sm"
                                                        placeholder="Add semantic intelligence..."
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchemaEditor;
