package com.foresight.backend.repository;

import com.foresight.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findBySupabaseId(String supabaseId);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsBySupabaseId(String supabaseId);
}
