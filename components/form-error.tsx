// components/form-error.tsx
interface FormErrorProps {
  errors?: string[];
}

export const FormError = ({ errors }: FormErrorProps) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="space-y-1 mt-1">
      {errors.map((error) => (
        <p key={error} className="text-xs text-destructive font-medium bg-destructive/10 p-1 rounded">
          {error}
        </p>
      ))}
    </div>
  );
};