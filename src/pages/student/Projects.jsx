import {
  useEffect,
  useState,
} from "react";

import {
  createProject,
  getMyProjects,
  deleteProject,
} from "../../services/projectService";

const Projects = () => {
  const [projects,
    setProjects] =
    useState([]);

  const [form,
    setForm] =
    useState({
      title: "",
      description: "",
      technologies: "",
      githubLink: "",
      projectLink: "",
    });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects =
    async () => {
      try {
        const data =
          await getMyProjects();

        setProjects(
          data.projects
        );
      } catch (error) {
        console.log(error);
      }
    };

  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await createProject({
          ...form,

          technologies:
            form.technologies
              .split(",")

              .map(
                (t) =>
                  t.trim()
              ),
        });

        alert(
          "Project Added"
        );

        setForm({
          title: "",
          description: "",
          technologies: "",
          githubLink: "",
          projectLink: "",
        });

        fetchProjects();

      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  const handleDelete =
    async (id) => {
      try {
        const data =
          await deleteProject(
            id
          );

        alert(
          data.message
        );

        fetchProjects();

      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        Projects
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          value={
            form.description
          }
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          name="technologies"
          placeholder="React, Node"
          value={
            form.technologies
          }
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          name="githubLink"
          placeholder="Github"
          value={
            form.githubLink
          }
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          name="projectLink"
          placeholder="Project URL"
          value={
            form.projectLink
          }
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <button
          type="submit"
        >
          Add Project
        </button>
      </form>

      <hr />

      <h2>
        My Projects
      </h2>

      {projects.map(
        (
          project
        ) => (
          <div
            key={
              project._id
            }
            style={{
              border:
                "1px solid #ddd",

              padding:
                "15px",

              marginBottom:
                "10px",
            }}
          >
            <h3>
              {
                project.title
              }
            </h3>

            <p>
              {
                project.description
              }
            </p>

            <p>
              {
                project.technologies.join(
                  ", "
                )
              }
            </p>

            <button
              onClick={() =>
                handleDelete(
                  project._id
                )
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Projects;