import { getCompanies } from '@/api/apiCompanies';
import { addNewJob } from '@/api/apijobs';
import AddCompanyDrawer from '@/components/add-company-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { State } from 'country-state-city';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, {message: "Title is Required"}),
  description: z.string().min(1, {message: "Description is Required"}),
  location: z.string().min(1, {message: "Select a location"}),
  company_id: z.string().min(1, {message: "Select or Add a new company"}),
  requirements: z.string().min(1, {message: "Requirements is Required"}),
})

const PostJob = () => {
  
  const {isLoaded, user} = useUser();
  const navigate = useNavigate();

  const {register, control, handleSubmit, formState:{errors}} = useForm({
    defaultValues:{
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const { fn: fnCompanies, data: companies =[], loading: loadingComapnies, } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn:fnCreateJob,
    } = useFetch(addNewJob);

    const onSubmit = (data) => {
      fnCreateJob({
        ...data,
        recruiter_id: user.id,
        isOpen: true,
      });
    };

    useEffect(() => {
      if (dataCreateJob?.length>0) navigate("/jobs");
    }, [loadingCreateJob]);

  if(!isLoaded || loadingComapnies) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>;
  }

  if (user?.unsafeMetadata?.role !== "recruiter"){
    return <Navigate to = "/jobs" />
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post any Job here</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
        <Input placeholder="Job title" {...register("title")}/>
        {errors.title && <p className='text-red-600'>{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")}/>
        {errors.description && (<p className='text-red-600'>{errors.description.message}</p>)}

        <div className='flex gap-4 items-center'>
        <Controller
          name="location"
          control={control}
          render={({field}) => (
            <Select value={field.value}  onValueChange={field.onChange} className='relative'>
            <SelectTrigger>
              <SelectValue placeholder="Filter your Location" />
            </SelectTrigger>
          <SelectContent>
          <SelectGroup>
            {State.getStatesOfCountry("IN").map(({name}) => {
              return (
                <SelectItem key={name} value={name}>
                  {name} 
                </SelectItem>
              );
            })}
          </SelectGroup>
          </SelectContent>
          </Select>
          )} />
        
        <Controller
          name="company_id"
          control={control}
          render={({field}) => (
            <Select value={field.value}  onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter your Company" >
                {field.value? companies?.find((com) => com.id === Number(field.value))?.name : "company"}
              </SelectValue>
            </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({name, id}) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name} 
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
          </Select>
        )}/>
        
        {/* Adding Company Drawer */}
        <AddCompanyDrawer fetchCompanies = {fnCompanies}/>
        {errors.location && (
          <p className='text-red-600'> {errors.location.message}</p> )}
        {errors.company_id && (
          <p className='text-red-600'> {errors.company_id.message}</p> )}
        
        
        </div>
        <Controller
          name="requirements"
          control={control}
          render={({field}) => (
            <MDEditor value={field.value}  onChange={field.onChange}/>
          )}/>
          {errors.requirements && (
            <p className='text-red-600'> {errors.requirements.message}</p> )}
          {errorCreateJob?.message && (
            <p className='text-red-600'> {errorCreateJob?.message}</p> )}
          
          {loadingCreateJob && <BarLoader width={"100%"} color='#36d7b7'/>}

          <Button type="submit" variant="destructive" size="lg" className="mt-2">Submit</Button>
      </form>
    </div>
  )
}

export default PostJob;