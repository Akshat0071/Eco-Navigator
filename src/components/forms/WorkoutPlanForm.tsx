import React, { useState, FormEvent } from 'react';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/apiService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiResponse } from '../../types';

interface WorkoutPlanFormProps {
  onSuccess?: (data: WorkoutPlanData) => void;
}

interface WorkoutPlanData {
  name: string;
  steps: string[];
  tips: string[];
}

interface WorkoutPlanFormData {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferences: string[];
  restrictions: string[];
}

export const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({ onSuccess }) => {
  const [duration, setDuration] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [preferenceInput, setPreferenceInput] = useState('');
  const [restrictionInput, setRestrictionInput] = useState('');

  const { data, loading, error, retryable, execute, reset } = useApi<WorkoutPlanData[]>(
    (params: WorkoutPlanFormData) => apiService.generateWorkoutPlan(params) as Promise<ApiResponse<WorkoutPlanData[]>>,
    { onSuccess }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    execute({
      duration,
      difficulty,
      preferences,
      restrictions,
    });
  };

  const addPreference = () => {
    if (preferenceInput.trim()) {
      setPreferences([...preferences, preferenceInput.trim()]);
      setPreferenceInput('');
    }
  };

  const removePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const addRestriction = () => {
    if (restrictionInput.trim()) {
      setRestrictions([...restrictions, restrictionInput.trim()]);
      setRestrictionInput('');
    }
  };

  const removeRestriction = (index: number) => {
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Generate Workout Plan</h2>
      
      {error && (
        <ErrorMessage
          message={error}
          retryable={retryable}
          onRetry={() => handleSubmit(new Event('submit') as unknown as FormEvent)}
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            min="5"
            max="120"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Preferences
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={preferenceInput}
              onChange={(e) => setPreferenceInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="Add a preference (e.g., outdoor, cardio)"
            />
            <button
              type="button"
              onClick={addPreference}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
              >
                {pref}
                <button
                  type="button"
                  onClick={() => removePreference(index)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Restrictions
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={restrictionInput}
              onChange={(e) => setRestrictionInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="Add a restriction (e.g., knee injury, back pain)"
            />
            <button
              type="button"
              onClick={addRestriction}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {restrictions.map((rest, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
              >
                {rest}
                <button
                  type="button"
                  onClick={() => removeRestriction(index)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="small" color="white" /> : 'Generate Plan'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
        </div>
      </form>
      
      {data && data.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold mb-2 text-green-700">{data[0].name || 'Workout Plan'}</h3>
          
          <div className="mb-4">
            <h4 className="font-bold mb-1">Steps:</h4>
            <ol className="list-decimal pl-5">
              {data[0].steps.map((step: string, index: number) => (
                <li key={index} className="mb-1">{step}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">Tips:</h4>
            <ul className="list-disc pl-5">
              {data[0].tips.map((tip: string, index: number) => (
                <li key={index} className="mb-1">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 