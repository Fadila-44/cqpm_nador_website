import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchContent, trackVisit } from "../services/api.js";

const ContentContext = createContext({
  cms: null,
  loading: true,
  error: null,
});

export function ContentProvider({ children }) {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchContent()
      .then((data) => {
        if (active) {
          setCms(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setCms(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    if (!sessionStorage.getItem("cqpm_visit_tracked")) {
      trackVisit()
        .then(() => sessionStorage.setItem("cqpm_visit_tracked", "1"))
        .catch(() => {});
    }

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ cms, loading, error }), [cms, loading, error]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
