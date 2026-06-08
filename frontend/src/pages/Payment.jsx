import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import StepIndicator from '../components/StepIndicator';
import Step1Instructions from '../steps/Step1Instructions';
import Step2Details      from '../steps/Step2Details';
import Step3Modules      from '../steps/Step3Modules';
import Step4Summary      from '../steps/Step4Summary';
import Step5Payment      from '../steps/Step5Payment';

export default function Payment() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState({ modules: [], subTotal: 0, grandTotal: 0, utrNumber: '', paymentDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const updateForm = fields => setForm(prev => ({ ...prev, ...fields }));

// ✅ Fixed — accept utrNumber and paymentDate as parameters
const submit = async (utrNumber, paymentDate) => {
  setSubmitting(true);
  try {
    const { data } = await api.post('/payment/submit', {
      modules:    form.modules,
      subTotal:   form.subTotal,
      grandTotal: form.grandTotal,
      utrNumber:  utrNumber,
      paymentDate: paymentDate
    });
      toast.success('Payment submitted!');
      navigate('/confirmation', { state: { payment: data, form: { ...form, paymentDate }, user } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <StepIndicator current={step} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="p-8">
            {step === 1 && <Step1Instructions onNext={next} />}
            {step === 2 && <Step2Details user={user} onNext={next} onBack={back} />}
            {step === 3 && <Step3Modules form={form} updateForm={updateForm} onNext={next} onBack={back} />}
            {step === 4 && <Step4Summary form={form} user={user} onNext={next} onBack={back} />}
            {step === 5 && <Step5Payment form={form} updateForm={updateForm} onBack={back} onSubmit={submit} submitting={submitting} />}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
