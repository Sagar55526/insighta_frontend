import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { getViewSchema, updateSchema } from '../../services/ingest';
import Button from '../common/Button';

const SchemaForm = ({ onSaveSuccess, defaultSchemaInfo }) => {
    const [schemaInfo, setSchemaInfo] = useState(defaultSchemaInfo || null);
    const [columns, setColumns] = useState(defaultSchemaInfo?.schema || []);
    const [loading, setLoading] = useState(!defaultSchemaInfo);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!defaultSchemaInfo) {
            fetchSchema();
        }
    }, [defaultSchemaInfo]);

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
            setColumns(data.schema || []);
        } catch (err) {
            console.error("Failed to fetch schema", err);
            setError('Failed to load schema.');
        } finally {
            setLoading(false);
        }
    };

    const handleColumnChange = (index, field, value) => {
        const newColumns = [...columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setColumns(newColumns);
        setSuccess(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await updateSchema({ schema: columns });
            setSuccess('Schema updated successfully!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (err) {
            console.error("Failed to update schema", err);
            setError('Failed to update schema. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!schemaInfo && !loading && error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-2">{error}</p>
                <Button onClick={fetchSchema} variant="outline" size="sm">Retry</Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Review Schema</h3>
                    {schemaInfo && (
                        <p className="text-sm text-gray-500 mt-1">
                            File: {schemaInfo.file_name}
                        </p>
                    )}
                </div>
                <Button onClick={handleSave} isLoading={saving} disabled={!schemaInfo}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    {success}
                </div>
            )}

            <div className="bg-white shadow overflow-auto max-h-[60vh] rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 relative">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Column Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {columns.map((col, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {col.column_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <input
                                        type="text"
                                        value={col.description || ''}
                                        onChange={(e) => handleColumnChange(idx, 'description', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="Description..."
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchemaForm;
