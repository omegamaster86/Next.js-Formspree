'use client'
import React, { useState } from 'react';
import axios from 'axios';

export const ContactUs: React.FC = () => {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });
  const [inputs, setInputs] = useState({
    email: '',
    message: '',
    companyName: '',
  });
  const handleServerResponse = (ok: any, msg: any) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        email: '',
        message: '',
        companyName: '',
      });
    } else {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: msg },
      });
    }
  };
  const handleOnChange = (e: any) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };
  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    axios({
      method: 'POST',
      url: process.env.NEXT_PUBLIC_CONTACK_FORM_ENDPOINT_URL,
      data: inputs,
    })
      .then((response) => {
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.',
        );
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error);
      });
  };
  return (
    <div className="flex flex-col justify-center pt-10 min-h-screen">
        <div className="flex-1 flex flex-col justify-center items-center pt-10 lg:pt-6">
            <h1>React and Formspree</h1>
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 mt-16 px-10 lg:mt-20 min-w-full lg:min-w-[500px]">
            <input id="companyName" name="companyName" required maxLength={128} type="text" placeholder="Company Name" className="bg-black text-white outline-none border-2 border-white rounded-3xl px-8 py-2" onChange={handleOnChange} value={inputs.companyName}/>
            <input id="email" name="email" type="email" required maxLength={128} placeholder="Your E-mail" className="bg-black text-white outline-none border-2 border-white rounded-3xl px-8 py-2" onChange={handleOnChange} value={inputs.email}/>
            <textarea id="message" name="message" required maxLength={1048576} placeholder="Additional information" className="bg-black text-white outline-none border-2 border-white rounded-3xl px-8 py-6 min-h-[16em]" onChange={handleOnChange} value={inputs.message}></textarea>
                <button type="submit" disabled={status.submitting}>
                {!status.submitting
                    ? !status.submitted
                    ? 'Submit'
                    : 'Submitted'
                    : 'Submitting...'}
                </button>
            </form>
            {status.info.error && (
                <div className="error">Error: {status.info.msg}</div>
            )}
            {!status.info.error && status.info.msg && <p>{status.info.msg}</p>}
        </div>
    </div>
  );
};