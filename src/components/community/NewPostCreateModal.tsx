import ModalTemplete from "@/components/ModalTemplete";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { useState, KeyboardEvent } from "react";
import { SquarePen, Tag, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Switch } from "@/components/ui/Switch";
import { useAuthStore } from "@/auth/authStore";
import CodeEditor from "@/components/ui/CodeEditor";
import Badge from "@/components/ui/Badge";
import { createCommunityPost } from "@/hooks/community/getCommunityPostData";
import { createPostData, blankCreatePostData } from "@/types/community/Post";

interface NewPostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPostCreateModal({ isOpen, onClose }: NewPostCreateModalProps) {
  const [step, setStep] = useState(1);
  const [isCode, setIsCode] = useState(false);

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const stepIcons = [SquarePen, Tag];
  const stepTitles = ["게시글 작성", "태그 추가"];

  const [formData, setFormData] = useState<createPostData>(blankCreatePostData);

  const [tagInput, setTagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (type: "tags", e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "tags") {
        const trimmedInput = tagInput.trim();
        if (trimmedInput && !formData.tags.includes(trimmedInput)) {
          const updatedTags = [...formData.tags, trimmedInput];
          setFormData({ ...formData, tags: updatedTags });
          setTagInput("");
        }
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags });
  };

  const moveNextStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.content) {
          useAuthStore.getState().setAlert("게시글을 입력해주세요.", "error");
          return;
        }
        break;
    }
    setStep(prevStep => prevStep + 1);
  }

  const handleSubmit = async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      useAuthStore.getState().setAlert("로그인 후 게시글을 작성할 수 있습니다.", "error");
      return;
    }
    
    setSubmitStatus('submitting');
    try {
      await createCommunityPost({
        ...formData,
        user_id: userId,
      });
      setSubmitStatus('success');
      useAuthStore.getState().setAlert("게시글이 생성되었습니다.", "success");
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("게시글 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
    } finally {
      setTimeout(() => {
        onClose();
        setFormData(blankCreatePostData);
        setSubmitStatus('idle');
        window.location.reload();
      }, 1000);
    }
  }

  const header = (
    <div>
      <h3 className="text-xl font-bold text-text-primary">새 게시글 작성</h3>
      <p className="text-point-color-indigo text-sm mt-1">사람들과 공유할 새로운 게시글을 만들어보세요</p>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-between">
      <button
        type="button"
        className="flex items-center gap-1 border border-component-border px-3 py-1 rounded-lg cursor-pointer active:scale-95 transition-all"
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>이전</span>
      </button>

      {step < totalSteps ? (
        <button
          type="button"
          className="flex items-center gap-1 bg-point-color-indigo text-white px-3 py-1 rounded-lg cursor-pointer active:scale-95 transition-all"
          onClick={() => moveNextStep(step)}
          disabled={step === totalSteps}
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <SubmitBtn
          submitStatus={submitStatus}
          onClick={handleSubmit}
          buttonText="게시글 작성"
          successText="생성 완료"
          errorText="생성 실패"
          withIcon
          fit
          className="!px-3 !py-1"
        />
      )}
    </div>
  )

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      footer={modalFooter}
    >
      <div className="flex flex-col">
        <div className="space-y-2">
          <div className="w-full h-4 bg-component-secondary-background rounded-full">
            <div className="h-full bg-point-color-indigo rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index]
              return (
                <div
                  key={title}
                  className={`flex items-center gap-1 ${step === index + 1 ? "text-text-primary font-medium" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {title}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center min-h-[300px] py-6">
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <SquarePen className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">게시글 작성</h3>
                  <p className="text-text-secondary">게시글을 작성해주세요</p>
                </div>
                <TextArea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={3}
                  placeholder="게시글을 입력해주세요."
                  label="게시글"
                  isRequired
                />

                <Switch
                  checked={isCode}
                  onChange={(e) => setIsCode(e)}
                  label="코드 포함"
                  labelClassName="!text-sm"
                  size="sm"
                />

                {isCode && (
                  <CodeEditor
                    value={formData.code?.code || ''}
                    onValueChange={(code) => setFormData({ 
                      ...formData, 
                      code: { 
                        ...(formData.code || { language: '', code: '' }), 
                        code 
                      } 
                    })}
                    languageValue={formData.code?.language || ''}
                    onLanguageChange={(language) => setFormData({ 
                      ...formData, 
                      code: { 
                        ...(formData.code || { language: '', code: '' }), 
                        language 
                      } 
                    })}
                  />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Tag className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">태그 추가</h3>
                  <p className="text-text-secondary">태그를 추가해주세요</p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={(e) => handleKeyDown("tags", e)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="태그를 입력하고 Enter 키를 누르세요"
                    label="태그"
                    isRequired
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        content={tag}
                        color="green"
                        isEditable={true}
                        onRemove={() => handleRemoveTag(tag)}
                        className="!px-2 !py-1 !font-semibold !text-xs !rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}