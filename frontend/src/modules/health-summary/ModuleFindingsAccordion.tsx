import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, ChevronUp, FileText, Ruler, Stethoscope, Pill } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface Module01Data {
  has_data: boolean;
  confirmed_observations_count: number;
  observations: Array<{
    analyte_name: string;
    value: string;
    unit: string;
    reference_range: string;
    status: string;
  }>;
}

interface Module02Data {
  has_data: boolean;
  total_score?: number;
  risk_category?: string;
  citation?: string;
}

interface Module03Data {
  has_data: boolean;
  primary_acuity?: string;
  emergency_override_triggered?: boolean;
  action_required?: string;
  safety_netting?: string;
}

interface Module04Data {
  has_data: boolean;
  total_medications: number;
  interaction_count: number;
  has_severe_warning: boolean;
  mandatory_disclaimer?: string;
}

interface ModuleFindingsAccordionProps {
  module01: Module01Data;
  module02: Module02Data;
  module03: Module03Data;
  module04: Module04Data;
}

export const ModuleFindingsAccordion: React.FC<ModuleFindingsAccordionProps> = ({
  module01,
  module02,
  module03,
  module04,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mod01: true,
    mod02: true,
    mod03: true,
    mod04: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Module-by-Module Audit Trail
      </h3>

      {/* Module 01 */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader
          onClick={() => toggleSection('mod01')}
          className="py-3 px-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Module 01: Confirmed Laboratory Observations
                </span>
                <Badge variant={module01.has_data ? 'normal' : 'neutral'} size="sm">
                  {module01.has_data ? `${module01.confirmed_observations_count} tests` : 'No Data'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Extracted and user-verified laboratory findings</p>
            </div>
          </div>
          {openSections.mod01 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </CardHeader>
        {openSections.mod01 && (
          <CardContent className="p-5 border-t border-slate-100">
            {module01.has_data && module01.observations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test / Analyte</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {module01.observations.map((obs, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-slate-900">{obs.analyte_name}</TableCell>
                      <TableCell className="font-mono">{obs.value}</TableCell>
                      <TableCell>{obs.unit}</TableCell>
                      <TableCell className="text-slate-500">{obs.reference_range || 'Not printed'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={obs.status === 'HIGH' || obs.status === 'ABNORMAL' ? 'high' : 'normal'}
                          size="sm"
                        >
                          {obs.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-slate-400 italic">No laboratory reports confirmed in this session.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Module 02 */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader
          onClick={() => toggleSection('mod02')}
          className="py-3 px-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Module 02: Indian Diabetes Risk Score (IDRS)
                </span>
                <Badge variant={module02.has_data ? (module02.risk_category === 'high' ? 'high' : 'normal') : 'neutral'} size="sm">
                  {module02.has_data ? `${module02.total_score} / 100` : 'No Data'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Validated 4-factor risk assessment by Mohan et al.</p>
            </div>
          </div>
          {openSections.mod02 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </CardHeader>
        {openSections.mod02 && (
          <CardContent className="p-5 border-t border-slate-100 text-xs text-slate-700 space-y-2">
            {module02.has_data ? (
              <div className="space-y-1">
                <p><strong>Total Score:</strong> {module02.total_score} / 100 ({module02.risk_category?.toUpperCase()} Risk)</p>
                <p className="text-slate-500"><strong>Citation:</strong> {module02.citation}</p>
              </div>
            ) : (
              <p className="text-slate-400 italic">No IDRS calculation completed in this session.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Module 03 */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader
          onClick={() => toggleSection('mod03')}
          className="py-3 px-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Module 03: Symptom Triage Guidance
                </span>
                <Badge variant={module03.has_data ? (module03.emergency_override_triggered ? 'emergency' : 'normal') : 'neutral'} size="sm">
                  {module03.has_data ? module03.primary_acuity : 'No Data'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Deterministic rule engine with emergency red-flag priority</p>
            </div>
          </div>
          {openSections.mod03 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </CardHeader>
        {openSections.mod03 && (
          <CardContent className="p-5 border-t border-slate-100 text-xs text-slate-700 space-y-2">
            {module03.has_data ? (
              <div className="space-y-1">
                <p><strong>Acuity:</strong> {module03.primary_acuity}</p>
                <p><strong>Recommended Action:</strong> {module03.action_required}</p>
                {module03.safety_netting && (
                  <p className="text-slate-500"><strong>Safety-Netting:</strong> {module03.safety_netting}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">No symptom triage assessment completed in this session.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Module 04 */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader
          onClick={() => toggleSection('mod04')}
          className="py-3 px-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Module 04: Medication Interaction Checker
                </span>
                <Badge variant={module04.has_data ? (module04.has_severe_warning ? 'emergency' : 'normal') : 'neutral'} size="sm">
                  {module04.has_data ? `${module04.interaction_count} interaction(s)` : 'No Data'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">RxNorm brand normalization and evidence-based pairwise checks</p>
            </div>
          </div>
          {openSections.mod04 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </CardHeader>
        {openSections.mod04 && (
          <CardContent className="p-5 border-t border-slate-100 text-xs text-slate-700 space-y-2">
            {module04.has_data ? (
              <div className="space-y-1">
                <p><strong>Medications Evaluated:</strong> {module04.total_medications}</p>
                <p><strong>Interactions Found:</strong> {module04.interaction_count}</p>
                {module04.mandatory_disclaimer && (
                  <p className="text-slate-500 italic">{module04.mandatory_disclaimer}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">No medication interaction check performed in this session.</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
