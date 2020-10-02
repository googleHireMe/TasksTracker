﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using TasksTracker.Models.DatabaseModels;
using TasksTracker.Models.Requests;
using TasksTracker.Models.Responses;

namespace TasksTracker.Models.Profiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Task, TaskRequest>().ReverseMap();
            CreateMap<Task, TaskResponse>().ReverseMap();
        }
    }
}
