import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useApp } from '@/contexts/AppContext';
import { getRegistration, registerParticipant } from '@/api/educine';
import { getProductRouteConfig } from '@/lib/productParams';

interface RegistrationFormValues {
  name: string;
  mobile: string;
  email: string;
  place: string;
  gender: string;
  dob: string;
}

const formatDobDisplay = (value: string) => {
  if (!value) return '';

  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};

export function RegistrationForm() {
  const hiddenDateRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRegistration, clearScores } = useApp();
  const config = getProductRouteConfig(searchParams);
  const preservedSearch = searchParams.toString();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      place: '',
      gender: '',
      dob: '',
    },
  });

  const nameField = register('name', {
    required: 'Name is required.',
  });

  const mobileField = register('mobile', {
    required: 'Please enter a valid mobile number.',
    validate: (value) => value.replace(/\D/g, '').length >= 10 || 'Please enter a valid mobile number.',
  });

  const emailField = register('email', {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.',
    },
  });

  const placeField = register('place');
  register('gender');
  const genderValue = watch('gender');
  const dobField = register('dob');
  const dobValue = watch('dob');

  const onSubmit = async (form: RegistrationFormValues) => {
    const mobile = form.mobile.replace(/\D/g, '');

    setLoading(true);
    setServerError('');
    clearScores();

    try {
      const response = await registerParticipant({
        name: form.name.trim(),
        mobile,
        email: form.email.trim() || undefined,
        place: form.place.trim() || undefined,
        entityId: config.entityId || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
        source: config.source || undefined,
        sourceContext: config.sourceContext || undefined,
      });

      const participant = await getRegistration(response.registrationId);
      setRegistration(participant);

      const shouldOpenNotes = Boolean(response.hasAptitudeTest && response.hasAptitudeResult);
      const nextPath = shouldOpenNotes
        ? `/notes/${response.registrationId}`
        : `/test/${response.registrationId}`;

      navigate(preservedSearch ? `${nextPath}?${preservedSearch}` : nextPath);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg ?? 'Could not continue to the aptitude test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1d4f86]">WEFI Aptitude</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Career Discovery Starts Here</h1>
      </div>

      <Card className="space-y-5 p-5">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
            autoFocus
            error={errors.name?.message}
            {...nameField}
            onChange={(event) => {
              setServerError('');
              nameField.onChange(event);
            }}
          />

          <Input
            id="mobile"
            label="Mobile Number"
            type="tel"
            inputMode="numeric"
            maxLength={15}
            placeholder="Enter your mobile number"
            error={errors.mobile?.message}
            {...mobileField}
            onChange={(event) => {
              setServerError('');
              setValue('mobile', event.target.value.replace(/\D/g, '').slice(0, 15), {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Optional"
            error={errors.email?.message}
            {...emailField}
            onChange={(event) => {
              setServerError('');
              emailField.onChange(event);
            }}
          />

          <Input
            id="place"
            label="Place"
            placeholder="Town / locality"
            {...placeField}
            onChange={(event) => {
              setServerError('');
              placeField.onChange(event);
            }}
          />

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Gender</span>
            <Select
              value={genderValue || ''}
              onValueChange={(value) => {
                setServerError('');
                setValue('gender', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dob-display" className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="relative">
              <Input
                id="dob-display"
                type="text"
                placeholder="dd/mm/yyyy"
                error={errors.dob?.message}
                value={formatDobDisplay(dobValue || '')}
                readOnly
                onClick={() => {
                  hiddenDateRef.current?.showPicker?.();
                  hiddenDateRef.current?.focus();
                  hiddenDateRef.current?.click();
                }}
              />
              <input
                {...dobField}
                ref={hiddenDateRef}
                id="dob"
                type="date"
                value={dobValue || ''}
                onChange={(event) => {
                  setServerError('');
                  setValue('dob', event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7b95] transition hover:text-primary"
                onClick={() => {
                  hiddenDateRef.current?.showPicker?.();
                  hiddenDateRef.current?.focus();
                  hiddenDateRef.current?.click();
                }}
                tabIndex={-1}
                aria-label="Open date picker"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
            </div>
            {errors.dob?.message && <p className="text-sm text-red-600">{errors.dob.message}</p>}
          </div>

          {serverError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Start Aptitude Test
          </Button>
        </form>
      </Card>
    </div>
  );
}