import './Home.css';
import { Link } from 'react-router-dom';
import BlogList from '../../components/blogList/BlogList';
import BlogButton from '../../components/blogButton/BlogButton';

const Home = () => {
    return (
        <section className="blog-section">
            <div className="blog-intro">
                <Link className="blog-header " to="/">Bloggy - McBlog</Link>
                <h2 className="blog-title">How you doin...</h2>
                <p className="blog-description">
                    Read the blogs written by cranker. <br />
                    Infite scoll so you dont have to manually move to next page,
                    and when you get bored of reading click the button to generate new a blog.
                    View jobs here: {' '}
                    <Link className='job-link' to="/jobs">Jobs</Link>
                </p>
               <BlogButton />
            </div>
            <BlogList />
        </section>
    );
};

export default Home;