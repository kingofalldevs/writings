import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Copy, X } from 'lucide-react';

const typeConfig = {
  success: {
    icon: CheckCircle2,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  error: {
    icon: XCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
};

/**
 * NotificationModal — replaces browser alert() / confirm()
 *
 * Props:
 *   isOpen        boolean
 *   onClose       () => void
 *   title         string
 *   message       string
 *   type          'success' | 'error' | 'warning'   (default: 'success')
 *   copyText      string?  — if provided, shows a "Copy link" button
 *   onConfirm     () => void?  — if provided, renders a confirm action
 *   confirmText   string  (default: 'Got it')
 *   cancelText    string  (default: 'Cancel')
 */
const NotificationModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  copyText,
  onConfirm,
  confirmText = 'Got it',
  cancelText = 'Cancel',
}) => {
  const config = typeConfig[type] ?? typeConfig.success;
  const Icon = config.icon;

  const handleCopy = () => {
    if (copyText) navigator.clipboard.writeText(copyText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-[28px] bg-background border border-foreground/10 shadow-[0_32px_80px_rgba(0,0,0,0.25)] overflow-hidden">

              {/* Close */}
              <div className="flex justify-end px-6 pt-5">
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/30 hover:text-foreground hover:bg-foreground/8 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col items-center text-center px-8 pt-2 pb-8 gap-5">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center`}>
                  <Icon className={config.color} size={32} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[17px] font-semibold text-foreground">{title}</h3>
                  <p className="text-[13px] font-light leading-relaxed text-foreground/60 whitespace-pre-wrap">
                    {message}
                  </p>
                </div>

                {/* Copy link pill */}
                {copyText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/8 text-[12px] font-mono text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-all max-w-full truncate"
                  >
                    <Copy size={13} />
                    <span className="truncate max-w-[220px]">{copyText}</span>
                  </button>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full mt-1">
                  {onConfirm ? (
                    <>
                      <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="w-full py-3.5 rounded-2xl bg-foreground text-background text-[14px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        {confirmText}
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-2xl bg-foreground/5 text-foreground/60 text-[14px] font-medium hover:bg-foreground/10 active:scale-[0.98] transition-all"
                      >
                        {cancelText}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className="w-full py-3.5 rounded-2xl bg-foreground text-background text-[14px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      {confirmText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
