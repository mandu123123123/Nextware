import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Label, Input, Button } from '@windmill/react-ui'

function SelectAuth() {
  const router = useHistory();

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-full">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Create account</h1>
              <hr className="my-4"/>
              <div className="flex flex-row justify-between">
                <Link className="mt-4 w-1/2 h-32 flex flex-col gap-2 justify-center items-center" to={{pathname: "/create-account", state: { code: "A003" } }}>
                  <img width="64" height="64" src="https://img.icons8.com/pastel-glyph/64/student-male--v1.png"
                       alt="student-male--v1"/>
                  Student
                </Link>

                <Link className="mt-4 w-1/2 flex flex-col justify-center items-center" to={{pathname: "/create-account", state: {code: "A002"}}}>
                  <img width="64" height="64"
                       src="https://img.icons8.com/external-basicons-solid-edtgraphics/50/external-Teacher-teachers-basicons-solid-edtgraphics-8.png"
                       alt="external-Teacher-teachers-basicons-solid-edtgraphics-8"/>
                  Teacher
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default SelectAuth
