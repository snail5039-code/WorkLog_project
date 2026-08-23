package com.example.demo.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ProjectDao {

    @Select("""
            select count(*)
              from project
             where id = #{projectId}
               and ownerMemberId = #{memberId}
               and archivedAt is null
            """)
    int countOwnedActiveProject(int projectId, int memberId);
}
