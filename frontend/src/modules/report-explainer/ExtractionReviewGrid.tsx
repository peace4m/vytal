import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2, Check, Plus, AlertCircle } from 'lucide-react';

export interface ReviewItem {
  temp_id: string;
  analyte_name: string;
  observed_value?: number | null;
  observed_value_str?: string;
  unit?: string | null;
  lab_reference_range?: string | null;
  status_flag: string;
}

interface ExtractionReviewGridProps {
  items: ReviewItem[];
  onConfirm: (confirmedItems: ReviewItem[]) => void;
  onOpenManualAdd: () => void;
  isConfirming?: boolean;
}

export const ExtractionReviewGrid: React.FC<ExtractionReviewGridProps> = ({
  items: initialItems,
  onConfirm,
  onOpenManualAdd,
  isConfirming = false,
}) => {
  const [items, setItems] = useState<ReviewItem[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Editable fields buffer
  const [editVal, setEditVal] = useState<number | string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editRange, setEditRange] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('NORMAL');

  const startEdit = (item: ReviewItem) => {
    setEditingId(item.temp_id);
    setEditVal(item.observed_value ?? '');
    setEditUnit(item.unit ?? '');
    setEditRange(item.lab_reference_range ?? '');
    setEditStatus(item.status_flag);
  };

  const saveEdit = (temp_id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.temp_id === temp_id) {
          const numVal = parseFloat(String(editVal));
          return {
            ...item,
            observed_value: isNaN(numVal) ? item.observed_value : numVal,
            observed_value_str: `${editVal} ${editUnit}`.trim(),
            unit: String(editUnit).trim() || item.unit,
            lab_reference_range: String(editRange).trim() || item.lab_reference_range,
            status_flag: editStatus,
          };
        }
        return item;
      })
    );
    setEditingId(null);
  };

  const deleteRow = (temp_id: string) => {
    setItems((prev) => prev.filter((item) => item.temp_id !== temp_id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Review Extracted Laboratory Observations ({items.length})
          </h3>
          <p className="text-xs text-slate-500">
            Verify all values against your original report. You can edit any parameter or remove misidentified rows.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenManualAdd} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          Add Missing Test
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
          No tests currently in review table. Click "Add Missing Test" or upload another report.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Analyte</TableHead>
              <TableHead>Observed Result</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Lab Reference Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isEditing = editingId === item.temp_id;
              return (
                <TableRow key={item.temp_id}>
                  <TableCell className="font-medium text-slate-900">
                    {item.analyte_name}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-24 px-2 py-1 text-xs border rounded bg-white"
                      />
                    ) : (
                      <span className="font-semibold">{item.observed_value ?? item.observed_value_str}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border rounded bg-white"
                      />
                    ) : (
                      <span className="text-slate-500">{item.unit || '—'}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editRange}
                        onChange={(e) => setEditRange(e.target.value)}
                        className="w-32 px-2 py-1 text-xs border rounded bg-white"
                      />
                    ) : (
                      <span className="text-slate-500">{item.lab_reference_range || 'Not specified by lab'}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-2 py-1 text-xs border rounded bg-white"
                      >
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="LOW">LOW</option>
                        <option value="INDETERMINATE">INDETERMINATE</option>
                      </select>
                    ) : (
                      <Badge
                        variant={
                          item.status_flag === 'HIGH'
                            ? 'high'
                            : item.status_flag === 'LOW'
                            ? 'warning'
                            : item.status_flag === 'NORMAL'
                            ? 'normal'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {item.status_flag}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(item.temp_id)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                          title="Save Changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Edit Row"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteRow(item.temp_id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Safety Notice & Confirmation Action */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            By clicking confirm, you verify that these numbers match your official laboratory document.
          </span>
        </div>
        <Button
          onClick={() => onConfirm(items)}
          disabled={items.length === 0}
          isLoading={isConfirming}
          variant="primary"
          className="shrink-0 w-full sm:w-auto"
        >
          Confirm Extracted Results ({items.length})
        </Button>
      </div>
    </div>
  );
};
