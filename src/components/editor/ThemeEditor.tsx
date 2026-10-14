import { useCVStore } from '../../store/cvStore';
import { TEMPLATES } from '../../templates';

const FONTS = ['Inter', 'Roboto', 'Lora', 'Merriweather', 'Source Sans 3', 'Playfair Display'];

export default function ThemeEditor() {
  const theme = useCVStore((s) => s.cv.theme);
  const settings = useCVStore((s) => s.cv.settings);
  const updateTheme = useCVStore((s) => s.updateTheme);
  const updateSettings = useCVStore((s) => s.updateSettings);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-medium text-slate-600 mb-2">Template</div>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => {
            const active = theme.template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateTheme({ template: t.id })}
                className={`p-2 text-start rounded border ${
                  active
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-sm font-medium text-slate-800">{t.name}</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  {t.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">Font</span>
        <select
          value={theme.fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
          className="mt-1 w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">Accent color</span>
        <input
          type="color"
          value={theme.accent}
          onChange={(e) => updateTheme({ accent: e.target.value })}
          className="mt-1 w-full h-8 rounded border border-slate-200 cursor-pointer"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          Font size: {theme.fontSize}px
        </span>
        <input
          type="range"
          min={11}
          max={18}
          value={theme.fontSize}
          onChange={(e) => updateTheme({ fontSize: Number(e.target.value) })}
          className="mt-1 w-full"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          Line height: {theme.lineHeight}
        </span>
        <input
          type="range"
          min={1.2}
          max={2}
          step={0.05}
          value={theme.lineHeight}
          onChange={(e) => updateTheme({ lineHeight: Number(e.target.value) })}
          className="mt-1 w-full"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          Section spacing: {theme.spacing.toFixed(1)}
        </span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={theme.spacing}
          onChange={(e) => updateTheme({ spacing: Number(e.target.value) })}
          className="mt-1 w-full"
        />
      </label>

      <div className="border-t border-slate-200 pt-3 space-y-3">
        <label className="flex items-center justify-between text-xs text-slate-600">
          <span>Show photo</span>
          <input
            type="checkbox"
            checked={settings.showPhoto}
            onChange={(e) => updateSettings({ showPhoto: e.target.checked })}
            className="rounded border-slate-300"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-600">
            Print margin: {settings.printMargin}mm
          </span>
          <input
            type="range"
            min={6}
            max={25}
            value={settings.printMargin}
            onChange={(e) => updateSettings({ printMargin: Number(e.target.value) })}
            className="mt-1 w-full"
          />
          <span className="text-[11px] text-slate-400">
            Increase if sides get cut when printing.
          </span>
        </label>
      </div>
    </div>
  );
}