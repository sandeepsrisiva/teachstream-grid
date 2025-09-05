import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { dummyApi } from '@/services/dummyApi';
import { Quiz, Question } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const QuizManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    questions: [{ question_text: '', options: ['', '', '', ''], correct_answer: '' }] as Question[]
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await dummyApi.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      questions: [{ question_text: '', options: ['', '', '', ''], correct_answer: '' }] as Question[]
    });
    setEditingQuiz(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const quizData = {
        title: formData.title,
        questions: formData.questions.map((q, index) => ({
          ...q,
          id: (index + 1).toString()
        })),
        created_by: user?.id || '1'
      };

      if (editingQuiz) {
        await dummyApi.updateQuiz(editingQuiz.id, quizData);
        toast({
          title: "Success",
          description: "Quiz updated successfully",
        });
      } else {
        await dummyApi.createQuiz(quizData);
        toast({
          title: "Success",
          description: "Quiz created successfully",
        });
      }

      await loadQuizzes();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      questions: quiz.questions
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await dummyApi.deleteQuiz(quizId);
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        });
        await loadQuizzes();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete quiz",
          variant: "destructive",
        });
      }
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' } as Question]
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Quiz Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      Add Question
                    </Button>
                  </div>

                  {formData.questions.map((question, qIndex) => (
                    <Card key={qIndex}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label>Question {qIndex + 1}</Label>
                            {formData.questions.length > 1 && (
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeQuestion(qIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <Textarea
                            placeholder="Enter question text"
                            value={question.question_text}
                            onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                            required
                          />

                          <div className="space-y-2">
                            <Label>Options</Label>
                            {question.options.map((option, oIndex) => (
                              <Input
                                key={oIndex}
                                placeholder={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[oIndex] = e.target.value;
                                  updateQuestion(qIndex, 'options', newOptions);
                                }}
                                required
                              />
                            ))}
                          </div>

                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Input
                              placeholder="Enter the correct answer exactly as written in options"
                              value={question.correct_answer}
                              onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.questions.length} questions • Created on {new Date(quiz.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(quiz)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(quiz.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No quizzes created yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};