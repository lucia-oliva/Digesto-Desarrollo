import { useCallback, useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function shouldShowField({ entidad, formData, omitPwdFields }, fieldName) {
  if (entidad === "usuario") {
    if (omitPwdFields && (fieldName === "password" || fieldName === "confirmPassword")) {
      return false;
    }
    if (fieldName === "dependencia") {
      return ["2", "4"].includes(String(formData?.rol ?? ""));
    }
  }

  if(entidad === "normativa"){
    if(fieldName === "normativa_interdepartamental"){
      return String(formData?.emisor ?? "") === "5";
    }
  }


  return true;
}

export function usePasoForm({ entidad, campos, formData, setFormData, onNext, setErrores, omitPwdFields }) {
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const applyErrors = useCallback((e) => {
    setErrors(e);
    setErrores?.(e);
  }, [setErrores]);

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, files, checked } = e.target;
    const nextValue =
      type === "file" ? (files?.[0] ?? null)
      : type === "checkbox" ? checked
      : type === "number" ? (value === "" ? "" : Number(value))
      : value;

       if (name === "emisor") {
    const asString = String(nextValue ?? "");
    if (asString !== "5") {
      setFormData((prev) => {
        const copy = { ...prev, emisor: nextValue };
        delete copy.normativa_interdepartamental;
        return copy;
      });
      return;
    }
  }

    updateField(name, nextValue);
  }, [setFormData,updateField]);

  const commitTags = useCallback((raw) => {
    const tags = String(raw || "")
      .split(/[,|\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) return;
    updateField("tags", [ ...(formData.tags || []), ...tags ]);
    setTagInput("");
  }, [formData.tags, updateField]);

  const handleTagKeyDown = useCallback((e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      commitTags(tagInput);
    }
  }, [commitTags, tagInput]);

  const handleRemoveTag = useCallback((indexToRemove) => {
    const nextTags = (formData.tags || []).filter((_, i) => i !== indexToRemove);
    updateField("tags", nextTags);
  }, [formData.tags, updateField]);

  const preventImplicitSubmit = useCallback((e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && !["textarea", "submit", "button"].includes(e.target.type)) {
      e.preventDefault();
    }
  }, []);

  const validar = useCallback(() => {
    const nuevosErrores = {};
    const isUser = entidad === "usuario";
    const isCreate = isUser && !formData?.id;
    const willEditPwd = isCreate || !!formData?._passwordEdited;

    campos.forEach(({ name, required }) => {
      if (!shouldShowField({ entidad, formData, omitPwdFields }, name)) return;

      const value = formData[name];
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (name === "archivo") {
        const archivo = Array.isArray(value) ? value[0] : value;
        const hayPrevio = typeof archivo === "string" && archivo.trim() !== "";
        const hayNuevo  = archivo && typeof archivo === "object" && archivo.name;
        if (!hayPrevio && !hayNuevo) {
          nuevosErrores[name] = "Debe subir un archivo PDF.";
          return;
        }
        if (hayNuevo) {
          const isPDF = archivo.type === "application/pdf" || archivo.name?.toLowerCase().endsWith(".pdf");
          if (!isPDF) nuevosErrores[name] = "El archivo debe ser un PDF.";
        }
        return;
      }

      if (name === "tags" && isEmpty) {
        nuevosErrores[name] = "Debe ingresar al menos un tag.";
        return;
      }

      if (required && isEmpty && name !== "archivo" && name !== "tags") {
        nuevosErrores[name] = "Este campo es obligatorio.";
      }

      if (name === "email" && !isEmpty) {
        if (!emailRegex.test(String(value))) {
          nuevosErrores[name] = "Formato de email inválido.";
          return;
        }
      }

    

    });

if (entidad === "normativa" && String(formData?.emisor ?? "") === "5") {
      const v = formData?.normativa_interdepartamental;
      const isEmpty = v === undefined || v === null || String(v).trim() === "";
      if (isEmpty) {
        nuevosErrores.normativa_interdepartamental = "Debe seleccionar la dependencia interdepartamental.";
      }
    }

    if (willEditPwd) {
      const p = String(formData.password ?? "");
      const c = String(formData.confirmPassword ?? "");
      if (!p) nuevosErrores.password = "Este campo es obligatorio.";
      if (!c) nuevosErrores.confirmPassword = "Este campo es obligatorio.";
      if (p) {
        const rules = [
          { test: /.{8,}/, message: "mínimo 8 caracteres" },
          { test: /[a-z]/, message: "una minúscula" },
          { test: /[A-Z]/, message: "una mayúscula" },
          { test: /\d/,   message: "un número" },
        ];
        const faltan = rules.filter(r => !r.test.test(p)).map(r => r.message);
        if (faltan.length) {
          nuevosErrores.password = `La contraseña es débil. Falta: ${faltan.join(", ")}.`;
        }
      }
      if (p && c && p !== c) {
        nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
      }
    }

    applyErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [campos, entidad, formData, omitPwdFields, applyErrors]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (tagInput.trim()) commitTags(tagInput);
    if (validar()) onNext();
  }, [commitTags, onNext, tagInput, validar]);

  return {
    tagInput,
    setTagInput,
    handleChange,
    handleTagKeyDown,
    commitTags,
    handleRemoveTag,
    preventImplicitSubmit,
    onSubmit,
    errors,
  };
}
