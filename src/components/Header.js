import "./Header.css";
export default function Header({ PageTitle }) {
    document.title = PageTitle
    return (
        <>
            <header>
                <nav>

                    <div className="PageTitle">
                        {PageTitle}
                    </div>
                    <div className="PageSubtitle">

                    </div>
                </nav>
            </header>
        </>)
}