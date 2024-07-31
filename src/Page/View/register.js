import { createRoot } from 'react-dom/client';
import HomeView from './Home';

const Tmouse = (() => {
    let container = null
    return {
        register: () => {
            if (!container) {
                container = document.createElement('div')
                container.className = 'tmouse-container'
                document.body.appendChild(container)
                createRoot(container).render(<HomeView />)
            }
        },
        unregister: () => {
            if (container) {
                document.body.removeChild(container)
                container = null
            }
        }
    }
})();

export default Tmouse;