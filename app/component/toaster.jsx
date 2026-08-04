import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const TOAST_EVENT = "app:toast";

export function showToast(message, type = "success") {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message,
        type,
      },
    })
  );
}

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleToast = (event) => {
      const { id, message = "", type = "success" } = event.detail ?? {};
      if (!message) return;

      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, 2600);
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  const typeStyles = {
    success: {
      badge: "bg-emerald-100 text-emerald-700",
      text: "text-emerald-700",
      icon: faCheckCircle,
    },
    info: {
      badge: "bg-sky-100 text-sky-700",
      text: "text-sky-700",
      icon: faCircleInfo,
    },
    error: {
      badge: "bg-rose-100 text-rose-700",
      text: "text-rose-700",
      icon: faTriangleExclamation,
    },
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const styles = typeStyles[toast.type] ?? typeStyles.success;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg shadow-gray-200/70"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${styles.badge}`}>
              <FontAwesomeIcon icon={styles.icon} className="text-sm" />
            </span>
            <p className={`text-sm font-semibold ${styles.text}`}>{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
