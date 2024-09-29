import React, { useState } from 'react';
import axios from 'axios';
import { Input, Label } from '@windmill/react-ui';


const EditMember = ({ member, onSave, onCancel }) => {
    const [editedMember, setEditedMember] = useState(member);

    const handleInputChange = (field, value) => {
        setEditedMember(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/management/${editedMember.userId}`, editedMember);
            onSave(editedMember);
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">회원 정보 수정</h2>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">권한</label>
                <select
                    value={editedMember.authorityId || ''}
                    onChange={(e) => handleInputChange('authorityId', e.target.value)}
                    className="pl-2 py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="A001">A001</option>
                    <option value="A002">A002</option>
                    <option value="A003">A003</option>
                </select>
            </div>
            {['userPw', 'name', 'email', 'phone', 'address', 'birth', 'gender'].map((field) => (
                <div key={field} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">{field}</label>
                    {field === 'birth' ? (
                        <Label className="mt-2">

                            <Input
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                type="date"
                                name="birth"
                                value={editedMember.birth || ''}
                                onChange={(e) => handleInputChange('birth', e.target.value)}
                            />
                        </Label>
                    ) : field === 'gender' ? (
                        <Label className="mt-2">
                            <div>
                                <label className="mr-4">
                                    <Input
                                        className="mt-1"
                                        type="radio"
                                        name="gender"
                                        value="M"
                                        checked={editedMember.gender === 'M'}
                                        onChange={(e) => handleInputChange('gender', 'M')}
                                    />
                                    남자
                                </label>
                                <label>
                                    <Input
                                        className="mt-1"
                                        type="radio"
                                        name="gender"
                                        value="W"
                                        checked={editedMember.gender === 'W'}
                                        onChange={(e) => handleInputChange('gender', 'W')}
                                    />
                                    여자
                                </label>
                            </div>
                        </Label>
                    ) : (
                        <input
                            type="text"
                            value={editedMember[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    )}
                </div>
            ))}

            <div className="flex justify-end space-x-2 mt-4">
                {/*<button type="button" onClick={onCancel}*/}
                {/*        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">*/}
                {/*    취소*/}
                {/*</button>*/}
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    저장
                </button>
            </div>
        </form>
    );
};

export default EditMember;
